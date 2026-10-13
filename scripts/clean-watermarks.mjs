// Elimina marcas de procedencia/IA incrustadas en los archivos del proyecto (equivalente en Node a las capas
// "file metadata" y "Unicode invisible" de github.com/guillaumemeyer/watermarks-remover):
//   · Imágenes JPEG/PNG: quita C2PA (Content Credentials), EXIF, XMP, IPTC, comentarios y datos tras el fin
//     de imagen. Es sin pérdida: no se re-comprime, solo se descartan bloques de metadatos. Se conserva el
//     perfil de color ICC y los bloques JFIF/Adobe para que los colores no cambien.
//   · Texto (.astro, .js, .json, .md, .css…): quita caracteres invisibles (ancho cero, control bidi, tags)
//     y normaliza espacios exóticos. Respeta las secuencias de emojis.
// Uso: node scripts/clean-watermarks.mjs          (solo revisa; sale con código 1 si encuentra algo)
//      node scripts/clean-watermarks.mjs --write  (aplica los cambios)
import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const WRITE = process.argv.includes('--write');
const ROOTS = ['.', 'src', 'public', 'scripts'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.vercel', '.claude']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const TEXT_EXT = new Set(['.astro', '.js', '.mjs', '.jsx', '.json', '.md', '.css', '.html', '.txt', '.xml', '.svg']);
const TEXT_SKIP = new Set(['package-lock.json']);

// ---------- JPEG ----------
// Segmentos APPn que se conservan: APP0 (JFIF), APP2 solo si es ICC_PROFILE, APP14 (Adobe, define el espacio de color).
function keepJpegSegment(marker, payload) {
  if (marker === 0xe0 || marker === 0xee) return true;
  if (marker === 0xe2) return payload.subarray(0, 12).toString('latin1') === 'ICC_PROFILE\0';
  if (marker >= 0xe1 && marker <= 0xef) return false; // EXIF/XMP (APP1), C2PA/JUMBF (APP11), IPTC (APP13)…
  if (marker === 0xfe) return false; // COM
  return true; // tablas, SOF, DHT, DQT, DRI…
}

function stripJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('JPEG inválido');
  const out = [buf.subarray(0, 2)];
  const removed = [];
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`Marcador esperado en byte ${i}`);
    while (buf[i + 1] === 0xff) i++; // bytes de relleno
    const marker = buf[i + 1];
    if (marker === 0xda) {
      // SOS: a partir de aquí son datos de imagen hasta EOI (FFD9); lo que venga después se descarta.
      let end = i + 2;
      while (end < buf.length - 1 && !(buf[end] === 0xff && buf[end + 1] === 0xd9)) end++;
      if (end >= buf.length - 1) throw new Error('No se encontró el fin de imagen (EOI)');
      out.push(buf.subarray(i, end + 2));
      if (end + 2 < buf.length) removed.push(`${buf.length - end - 2} B tras EOI`);
      break;
    }
    const len = buf.readUInt16BE(i + 2);
    const payload = buf.subarray(i + 4, i + 2 + len);
    if (keepJpegSegment(marker, payload)) out.push(buf.subarray(i, i + 2 + len));
    else removed.push(`${jpegSegmentName(marker, payload)} (${len} B)`);
    i += 2 + len;
  }
  return { data: Buffer.concat(out), removed };
}

function jpegSegmentName(marker, payload) {
  if (marker === 0xfe) return 'comentario';
  if (marker === 0xeb) return 'C2PA/JUMBF';
  if (marker === 0xed) return 'IPTC';
  const id = payload.subarray(0, 28).toString('latin1');
  if (id.startsWith('Exif')) return 'EXIF';
  if (id.includes('ns.adobe.com/xap')) return 'XMP';
  return `APP${marker - 0xe0}`;
}

// ---------- PNG ----------
// Chunks de metadatos que se eliminan; el resto (IHDR, IDAT, PLTE, iCCP, sRGB, gAMA, pHYs…) se conserva.
const PNG_DROP = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME', 'caBX']);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function stripPng(buf) {
  if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('PNG inválido');
  const out = [PNG_SIG];
  const removed = [];
  let i = 8;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.subarray(i + 4, i + 8).toString('latin1');
    const chunk = buf.subarray(i, i + 12 + len);
    if (PNG_DROP.has(type)) removed.push(`${type === 'caBX' ? 'C2PA' : type} (${len} B)`);
    else out.push(chunk);
    i += 12 + len;
    if (type === 'IEND') {
      if (i < buf.length) removed.push(`${buf.length - i} B tras IEND`);
      break;
    }
  }
  return { data: Buffer.concat(out), removed };
}

// Garantía de que no se rompe nada: la imagen limpia debe decodificar a exactamente los mismos píxeles.
async function assertSamePixels(before, after, file) {
  const [a, b] = await Promise.all([sharp(before).raw().toBuffer(), sharp(after).raw().toBuffer()]);
  if (!a.equals(b)) throw new Error(`${file}: los píxeles cambiaron, no se modifica`);
}

// ---------- Texto ----------
const INVISIBLE =
  /[\u200B\u200C\u200D\u2060-\u2064\uFEFF\u200E\u200F\u061C\u202A-\u202E\u2066-\u2069\u180E\u034F\u115F\u1160\u3164\uFFA0\u{E0000}-\u{E007F}]/u;
const EXOTIC_SPACES = /[\u2000-\u200A\u202F\u205F\u3000]/;
const PICTO = /\p{Extended_Pictographic}/u;

function cleanText(text) {
  let count = 0;
  const chars = [...text];
  const cleaned = chars
    .map((ch, idx) => {
      if (EXOTIC_SPACES.test(ch)) {
        count++;
        return ' ';
      }
      if (!INVISIBLE.test(ch)) return ch;
      const cp = ch.codePointAt(0);
      const prev = chars[idx - 1] ?? '';
      // Las uniones de emojis (ZWJ entre pictogramas) y las banderas con tags son legitimas.
      if (cp === 0x200d && PICTO.test(prev) && PICTO.test(chars[idx + 1] ?? '')) return ch;
      if (cp >= 0xe0000 && (prev === '\u{1F3F4}' || (prev.codePointAt(0) ?? 0) >= 0xe0000)) return ch;
      count++;
      return '';
    })
    .join('');
  return { data: cleaned, count };
}

// ---------- Recorrido ----------
async function* walk(dir, recursive) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((err) => {
    if (err.code === 'ENOENT') return [];
    throw err;
  });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive && !SKIP_DIRS.has(entry.name)) yield* walk(path, true);
    } else yield path;
  }
}

async function saveAtomic(file, data) {
  const tmp = `${file}.tmp-clean`;
  await writeFile(tmp, data);
  await rename(tmp, file);
}

let findings = 0;
for (const root of ROOTS) {
  for await (const file of walk(root, root !== '.')) {
    const ext = extname(file).toLowerCase();

    if (IMAGE_EXT.has(ext)) {
      const original = await readFile(file);
      const { data, removed } = ext === '.png' ? stripPng(original) : stripJpeg(original);
      if (!removed.length) continue;
      findings++;
      console.log(`${WRITE ? '✓' : '•'} ${file}: ${removed.join(', ')}`);
      if (WRITE) {
        await assertSamePixels(original, data, file);
        await saveAtomic(file, data);
      }
    } else if (TEXT_EXT.has(ext) && !TEXT_SKIP.has(file)) {
      const original = await readFile(file, 'utf8');
      const { data, count } = cleanText(original);
      if (!count) continue;
      findings++;
      console.log(`${WRITE ? '✓' : '•'} ${file}: ${count} carácter(es) invisible(s)`);
      if (WRITE) await saveAtomic(file, data);
    }
  }
}

if (!findings) console.log('Sin marcas de procedencia ni caracteres invisibles.');
else if (!WRITE) {
  console.log(`\n${findings} archivo(s) con marcas. Ejecuta "npm run watermarks:clean" para limpiarlos.`);
  process.exitCode = 1;
}

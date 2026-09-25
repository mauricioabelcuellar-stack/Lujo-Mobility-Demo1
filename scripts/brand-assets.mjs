// Genera los assets de marca a partir de los archivos originales entregados por el cliente:
// logo transparente para fondos oscuros, favicons, apple-touch-icon e imagen Open Graph.
// Uso: node scripts/brand-assets.mjs  (solo es necesario si cambian los originales)
import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';

const ORIGINALS = {
  logo: 'logo-Lujo-Mobility.jpg',
  favicon: 'logo-De-Ventana.jpg',
  hero: 'auto-lujo-mobility.jpg',
};
const BRAND_DIR = 'src/assets/brand';
const IMAGES_DIR = 'src/assets/images';

await mkdir(BRAND_DIR, { recursive: true });
await mkdir(IMAGES_DIR, { recursive: true });

// 1. Logo: el original es plateado sobre blanco. Se convierte la luminancia en canal alfa
//    y se aclara el tono para conservar el efecto metálico sobre fondos negros.
async function buildLogo() {
  const { data, info } = await sharp(ORIGINALS.logo)
    .extract({ left: 250, top: 222, width: 860, height: 334 })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const l = data[i];
    const alpha = Math.max(0, Math.min(1, (232 - l) / 27));
    const tone = Math.max(0, Math.min(255, 150 + ((l - 60) / 155) * 100));
    rgba[i * 4] = tone;
    rgba[i * 4 + 1] = tone;
    rgba[i * 4 + 2] = Math.min(255, tone + 4);
    rgba[i * 4 + 3] = Math.round(alpha * 255);
  }

  const logo = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim();
  await logo.clone().png({ compressionLevel: 9 }).toFile(`${BRAND_DIR}/logo-lujo-mobility.png`);
  return logo.png().toBuffer();
}

// 2. Favicon: el original simula transparencia con un damero dentro del JPG,
//    así que se recorta el emblema circular con una máscara.
async function buildFavicon() {
  const size = 752;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/></svg>`
  );
  const emblem = await sharp(ORIGINALS.favicon)
    .extract({ left: 512 - size / 2, top: 512 - size / 2, width: size, height: size })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const png = (px) => sharp(emblem).resize(px, px).png({ compressionLevel: 9 }).toBuffer();

  await writeFile('public/favicon.png', await png(96));

  // apple-touch-icon: iOS no admite transparencia, se usa fondo negro con margen.
  const touch = await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0a0a0a' } })
    .composite([{ input: await png(156), left: 12, top: 12 }])
    .png()
    .toBuffer();
  await writeFile('public/apple-touch-icon.png', touch);

  // favicon.ico con PNGs embebidos (16, 32 y 48 px).
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(png));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((px, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(px, entry);
    header.writeUInt8(px, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[i].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
  });
  await writeFile('public/favicon.ico', Buffer.concat([header, ...images]));
}

// 3. Imagen Open Graph 1200x630: foto del hero oscurecida con el logo.
async function buildOgImage(logoPng) {
  const shade = Buffer.from(
    `<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset=".6" stop-color="#000" stop-opacity=".35"/>
      <stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/></svg>`
  );
  const logo = await sharp(logoPng).resize({ width: 340 }).toBuffer();
  await sharp(ORIGINALS.hero)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .composite([{ input: shade }, { input: logo, left: 72, top: 56 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('public/og-image.jpg');
}

const logoPng = await buildLogo();
await buildFavicon();
await buildOgImage(logoPng);
await copyFile(ORIGINALS.hero, `${IMAGES_DIR}/hero-suv.jpg`);
console.log('Assets de marca generados.');

// Descarga las fotos de stock (Unsplash, licencia libre) a src/assets/images para que Astro las optimice.
// También funciona como registro de créditos de cada imagen.
// Uso: node scripts/fetch-stock-images.mjs  (omite las que ya existen)
import { mkdir, writeFile, access } from 'node:fs/promises';

const DIR = 'src/assets/images';

export const STOCK_IMAGES = [
  { file: 'servicio-aeropuerto.jpg', id: '9QOXaSuxIQQ', autor: 'Antwerp Reveal', raw: 'https://images.unsplash.com/photo-1689907517751-6380e24268f1' },
  { file: 'servicio-corporativo.jpg', id: '9xhwtVIM0dE', autor: 'Ilya Godze', raw: 'https://images.unsplash.com/photo-1764605206511-7a649d9df63b' },
  { file: 'servicio-chofer.jpg', id: 'bepnweLh8A0', autor: 'Ramy Mamdouh', raw: 'https://images.unsplash.com/photo-1737572457334-e6a6a329a1d4' },
  { file: 'servicio-escolta.jpg', id: 'hbQgmSJpJY0', autor: 'Rob Wingate', raw: 'https://images.unsplash.com/photo-1753030148276-75f09f40e6d9' },
  { file: 'servicio-eventos.jpg', id: 'x1yHtSg1DsQ', autor: 'Jorik Kleen', raw: 'https://images.unsplash.com/photo-1558620013-a08999547a36' },
  { file: 'servicio-larga-distancia.jpg', id: 'yNnxrWooG14', autor: 'Mota Ehdaei', raw: 'https://images.unsplash.com/photo-1777389805883-dcd60f77ef07' },
  { file: 'servicio-vip.jpg', id: 'n7pLpkhwXFk', autor: 'Niklas Jonasson', raw: 'https://images.unsplash.com/photo-1635672033263-a19f27eaefa8' },
  { file: 'nosotros-chofer.jpg', id: 't6sIyh2swzQ', autor: 'Volodymyr Proskurovskyi', raw: 'https://images.unsplash.com/photo-1514041181368-bca62cceffcd' },
  { file: 'interior-ejecutivo.jpg', id: 'c2RS4XvpLbA', autor: 'Michal Soukup', raw: 'https://images.unsplash.com/photo-1602506608630-8c2c5312dc8d' },
  { file: 'flota-sedan.jpg', id: 'FMbWFDiVRPs', autor: 'Samuele Errico Piccarini', raw: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5' },
  { file: 'flota-suv-ejecutiva.jpg', id: '3ZdKPcSQRIs', autor: 'George Barros', raw: 'https://images.unsplash.com/photo-1658006097063-d998b3cc0fab' },
  { file: 'flota-suv-premium.jpg', id: 'eqZxve5bPuo', autor: 'Tim Meyer', raw: 'https://images.unsplash.com/photo-1696315072449-ed50cb1b2888' },
  { file: 'flota-van.jpg', id: 'PNW4oeltJGo', autor: 'William G', raw: 'https://images.unsplash.com/photo-1765461734605-34657fa04db2' },
  { file: 'lima-costa-verde.jpg', id: '5YW0c-q4fvM', autor: 'paolo candelo', raw: 'https://images.unsplash.com/photo-1781978603498-138f85556048' },
  { file: 'lima-miraflores.jpg', id: '1ZP6kiS7pGM', autor: 'Mike Swigunski', raw: 'https://images.unsplash.com/photo-1589553666697-7243df84b113' },
  { file: 'trayecto-noche.jpg', id: 'umBmwe7CZXA', autor: 'Aditya Sethia', raw: 'https://images.unsplash.com/photo-1761295908283-9ee7782e82bd' },
  { file: 'faros-noche.jpg', id: 'CHVaY08VOIs', autor: 'Amir Hosseini', raw: 'https://images.unsplash.com/photo-1645252654964-af3dae1e54d3' },
  { file: 'detalle-ventana.jpg', id: 'vVwbcapKjmw', autor: 'Joel Durkee', raw: 'https://images.unsplash.com/photo-1722011865035-c32d53dfc543' },
  { file: 'aeropuerto-terminal.jpg', id: 'zrtbXkzWTQs', autor: 'Tsukada Kazuhiro', raw: 'https://images.unsplash.com/photo-1664188574017-c31b8a3604b6' },
];

await mkdir(DIR, { recursive: true });

for (const img of STOCK_IMAGES) {
  const target = `${DIR}/${img.file}`;
  try {
    await access(target);
    continue;
  } catch {}
  const res = await fetch(`${img.raw}?fm=jpg&q=78&w=2000&fit=max`);
  if (!res.ok) throw new Error(`No se pudo descargar ${img.file} (${res.status})`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${img.file} — Foto de ${img.autor} en Unsplash (https://unsplash.com/photos/${img.id})`);
}

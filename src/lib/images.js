// Resuelve los nombres de archivo de content.json a imágenes locales optimizables por <Image /> de Astro.
const files = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export function getImageAsset(fileName) {
  const image = files[`../assets/images/${fileName}`];
  if (!image) {
    throw new Error(`Imagen no encontrada en src/assets/images: "${fileName}"`);
  }
  return image;
}

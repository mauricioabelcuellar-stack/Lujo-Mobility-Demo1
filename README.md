# Lujo Mobility — Sitio institucional (demo)

Sitio institucional de **Lujo Mobility**, empresa de transporte ejecutivo y corporativo en Lima, Perú.
Es una **demo funcional** para presentar al cliente: todo el contenido es de ejemplo y se edita desde un solo archivo, `src/content.json`.

Stack: Astro 4 · React (islas) · Tailwind CSS v4 · shadcn/ui + Radix · Framer Motion · Embla Carousel · GSAP + ScrollTrigger · Lenis · lucide-react. Proyecto 100 % JavaScript (sin TypeScript).

---

## Requisitos previos

- **Node.js 18.17.1 o superior** (recomendado Node 20 LTS o más reciente). Verificar con `node -v`.
- **npm 9 o superior** (viene con Node). Verificar con `npm -v`.

## Levantar el proyecto desde cero

1. Abrir una terminal en la carpeta del proyecto.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la dirección que muestra la terminal (por defecto **http://localhost:4321**).

No hace falta configurar variables de entorno, bases de datos ni servicios externos.

## Comandos

| Comando             | Qué hace |
| ------------------- | -------- |
| `npm install`       | Descarga e instala todas las dependencias del proyecto en `node_modules/`. |
| `npm run dev`       | Levanta el servidor de desarrollo con recarga automática en `http://localhost:4321`. Ideal para editar y mostrar la demo. |
| `npm run build`     | Genera la versión de producción estática en `dist/`: páginas HTML, sitemap e imágenes optimizadas (WebP en varios tamaños). |
| `npm run preview`   | Sirve localmente la carpeta `dist/` para revisar el resultado del build tal como quedaría publicado. Requiere ejecutar `npm run build` antes. |
| `npm run assets:brand`  | (Opcional) Regenera logo transparente, favicons e imagen Open Graph a partir de los archivos originales del cliente. |
| `npm run assets:images` | (Opcional) Descarga las fotos de stock de Unsplash que falten en `src/assets/images/`. |

## Editar contenido

Todos los textos visibles (menú, títulos, servicios, flota, testimonios, contacto, footer, SEO y 404) están en **`src/content.json`**.
Guardá el archivo y el navegador se actualiza solo con `npm run dev`.

Datos placeholder que el cliente debe reemplazar antes de publicar:

- `site.telefono`, `site.email`, `site.whatsapp` (solo dígitos con código de país, por ejemplo `51987654321`) y `site.whatsappVisible`.
- `site.url` (dominio definitivo). **También actualizar la URL del sitemap en `public/robots.txt`.**
- Testimonios, logos de empresas (`empresas.items`), redes sociales (`footer.redes`) y vehículos de la flota.

## Publicación (deploy)

El proyecto genera un sitio 100 % estático (`dist/`) y está preparado para **Vercel**:

1. Importar el repositorio en Vercel (framework detectado: Astro).
2. Build command: `npm run build` · Output directory: `dist`.
3. `vercel.json` aplica los headers de seguridad (CSP, `nosniff`, `Referrer-Policy`, `X-Frame-Options`) y la política de barras finales.

Si se publica en otro hosting (Netlify, Nginx, Apache, Cloudflare Pages), los headers de seguridad **no** se aplican automáticamente: ver la sección "Headers de seguridad" en [DOCUMENTATION.md](DOCUMENTATION.md).

## Fuentes

Las tipografías (Playfair Display y Jost) se sirven **desde el propio sitio** mediante `@fontsource-variable`. No se usan CDNs externos, por lo que la CSP solo permite `font-src 'self'`.

## Más información

La arquitectura, las decisiones técnicas y las guías para agregar servicios, vehículos o testimonios están en [DOCUMENTATION.md](DOCUMENTATION.md).

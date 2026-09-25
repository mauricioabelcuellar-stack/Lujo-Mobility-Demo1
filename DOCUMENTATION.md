# Documentación técnica — Lujo Mobility

Guía de arquitectura y mantenimiento del sitio. Para instalar y ejecutar el proyecto, ver [README.md](README.md).

---

## 1. Arquitectura general

El sitio es **estático**: Astro genera todas las páginas HTML en el build y no existe backend, base de datos ni API propia.

- **Astro** es el framework principal. Renderiza páginas, layout y la mayoría de los componentes en HTML puro, sin JavaScript en el navegador.
- **React** se usa solo como **islas** en los tres componentes que necesitan estado o interacción: el menú móvil y los dos carruseles.
- **Todo el contenido textual** vive en `src/content.json`. Los componentes leen datos de ahí y no contienen textos propios.
- Las **animaciones** (GSAP + ScrollTrigger) y el **smooth scroll** (Lenis) se inicializan una sola vez desde el layout.

```
Petición → HTML estático (Astro) → CSS (Tailwind) → JS mínimo:
  · script de animaciones (GSAP + Lenis) — todas las páginas
  · script del header (scroll + dropdown) — todas las páginas
  · MobileMenu.jsx — solo en pantallas < 1024 px (client:media)
  · TestimonialsCarousel.jsx / ServiceCarousel.jsx — solo al entrar en pantalla (client:visible)
```

## 2. Estructura de carpetas

```text
├── astro.config.mjs          Configuración de Astro (React, sitemap, Tailwind, URL del sitio)
├── vercel.json               Headers de seguridad y barra final para Vercel
├── jsconfig.json             Configuración del editor para JS/JSX
├── public/                   Archivos servidos tal cual
│   ├── robots.txt            Referencia al sitemap
│   ├── favicon.ico / favicon.png / apple-touch-icon.png
│   └── og-image.jpg          Imagen para redes sociales (1200×630)
├── scripts/
│   ├── brand-assets.mjs      Genera logo transparente, favicons y og-image a partir de los originales
│   └── fetch-stock-images.mjs  Descarga las fotos de Unsplash y registra sus créditos
├── src/
│   ├── content.json          ★ Todo el contenido del sitio
│   ├── assets/
│   │   ├── brand/            Logo procesado (PNG transparente)
│   │   └── images/           Fotografías (optimizadas por Astro en el build)
│   ├── components/
│   │   ├── ui/               Componentes shadcn/ui adaptados a JSX (sheet, accordion)
│   │   ├── Header.astro      Header fijo + dropdown de servicios por hover
│   │   ├── MobileMenu.jsx    Menú lateral móvil (isla React)
│   │   ├── Footer.astro
│   │   ├── Hero.astro        Hero de la home
│   │   ├── PageHero.astro    Cabecera de páginas internas
│   │   ├── Breadcrumb.astro
│   │   ├── SectionHeading.astro
│   │   ├── ServicesGrid.astro / ServiceCard.astro
│   │   ├── ServiceCarousel.jsx       "También puedes consultar" (isla React)
│   │   ├── TestimonialsCarousel.jsx  Testimonios (isla React)
│   │   ├── VehicleCard.astro
│   │   ├── Stepper.astro     Pasos del proceso (timeline y compacto)
│   │   ├── Pillars.astro     Pilares de la marca
│   │   ├── ClientLogos.astro Empresas que confían (placeholders)
│   │   ├── CtaBand.astro     Banda de llamada a la acción
│   │   ├── WhatsAppButton.astro  Botón flotante
│   │   ├── Icon.astro        Icono lucide por nombre (sin JS)
│   │   └── BrandIcon.astro   Logos de WhatsApp y redes sociales (SVG)
│   ├── layouts/Layout.astro  HTML base, SEO, favicon, header, footer, scripts
│   ├── lib/
│   │   ├── icons.js          Mapeo nombre → icono de lucide-react
│   │   ├── images.js         Mapeo nombre de archivo → imagen optimizable
│   │   ├── site.js           Rutas, navegación y enlaces de contacto/WhatsApp
│   │   └── utils.js          cn() de shadcn y fill() para textos con {marcadores}
│   ├── pages/                Una ruta por archivo (ver sección 6)
│   ├── scripts/motion.js     Lenis + GSAP + ScrollTrigger
│   └── styles/global.css     Tokens de diseño (Tailwind v4) y componentes CSS
└── src/env.d.ts              Referencia de tipos que Astro regenera automáticamente (no es código de la app)
```

## 3. Rol de Astro y de React

| Tecnología | Dónde | Por qué |
| --- | --- | --- |
| Astro (`.astro`) | Páginas, layout, header, footer, tarjetas, secciones | Genera HTML sin JS. Carga rápida y buen SEO. |
| React (`.jsx`) + `client:media` | `MobileMenu.jsx` | Necesita estado, foco atrapado y accesibilidad (Radix Dialog). Solo se hidrata en pantallas móviles. |
| React (`.jsx`) + `client:visible` | `TestimonialsCarousel.jsx`, `ServiceCarousel.jsx` | Embla necesita JS. Se hidratan cuando el carrusel entra en pantalla. |

Los iconos de `lucide-react` usados dentro de componentes `.astro` se renderizan en el servidor como SVG estático, sin enviar React al navegador.

## 4. Organización de `content.json`

| Clave | Contenido |
| --- | --- |
| `site` | Nombre, URL, teléfono, email, WhatsApp, horario, área de servicio. **Datos de contacto únicos para todo el sitio.** |
| `navigation` | Etiquetas del menú, CTA y textos accesibles (aria) del menú. |
| `ui` | Microtextos reutilizables: "Ver servicio", "Anterior", "{n} de 5 estrellas", etc. |
| `inicio` | Hero (eyebrow, título en líneas, subtítulo, CTA, indicadores) y secciones de la home. |
| `pilares` | Seguridad, puntualidad, discreción y atención personalizada. |
| `nosotros` | Cabecera, historia y compromiso. |
| `servicios` | Textos de las páginas de servicios y `items` con los 7 servicios. |
| `flota` | Textos de la página y `items` con los vehículos. |
| `comoFunciona` | Textos y `pasos` del proceso. |
| `empresas` | Logos placeholder de clientes. |
| `testimonios` | Título, nota y `items` con las reseñas. |
| `cta` | Banda final de reserva. |
| `contacto` | Etiquetas y textos de la página de contacto. |
| `footer` | Descripción, títulos de columnas, redes y copyright (`{anio}` se reemplaza por el año actual). |
| `seo` | `title` y `description` de cada página. `seo.servicio.title` usa `{servicio}`. |
| `error404` | Textos de la página 404. |

Reglas del archivo:

- **Imágenes**: se indica solo el nombre de archivo (`"imagen": "flota-van.jpg"`) y el archivo debe estar en `src/assets/images/`. Cada imagen tiene su `imagenAlt`.
- **Iconos**: se indica el nombre del icono de lucide (`"icono": "Plane"`). Debe estar registrado en `src/lib/icons.js`.
- **Marcadores**: los textos con `{algo}` se completan en código (`{anio}`, `{servicio}`, `{n}`).
- Los datos de contacto están **solo** en `site` para no duplicarlos.
- Si falta un icono o una imagen, el build falla con un mensaje claro que indica cuál.

## 5. Servicios dinámicos y `getStaticPaths()`

`src/pages/servicios/[slug].astro` genera una página por cada elemento de `servicios.items`:

```js
export function getStaticPaths() {
  return services.map((service) => ({ params: { slug: service.slug }, props: { service } }));
}
```

- En el build, Astro llama a `getStaticPaths()`, obtiene la lista de slugs y crea `/servicios/<slug>/index.html` para cada uno.
- Cada página recibe su servicio por `props` y muestra breadcrumb, imagen grande, número, nombre, descripción larga, "Qué incluye", CTA de WhatsApp con mensaje prellenado y el carrusel con los otros 6 servicios.
- **Slugs inválidos**: como solo se generan los slugs existentes, cualquier otra URL (por ejemplo `/servicios/no-existe/`) no tiene archivo, y el hosting responde con `404.html`. En `npm run dev` Astro también muestra la 404 personalizada.

### Cómo agregar un servicio nuevo

1. Agregar la foto en `src/assets/images/` (horizontal, idealmente 2000 px de ancho).
2. Agregar un objeto al final de `servicios.items` en `content.json`:
   ```json
   {
     "slug": "traslado-bodas",
     "icono": "Heart",
     "numero": "08",
     "nombre": "Traslados para bodas",
     "resumen": "Texto corto para el menú desplegable",
     "descripcion": "Texto para la tarjeta (1-2 líneas).",
     "descripcionLarga": ["Primer párrafo destacado.", "Segundo párrafo."],
     "incluye": ["Ítem 1", "Ítem 2", "Ítem 3"],
     "imagen": "servicio-bodas.jpg",
     "imagenAlt": "Descripción de la foto"
   }
   ```
3. Si el icono no está en `src/lib/icons.js`, importarlo y agregarlo al objeto `icons`.

El servicio aparece automáticamente en el menú, el footer, la grilla, el sitemap y los carruseles. La grilla está diseñada para 7 servicios (4 + 3 en desktop). Si cambia la cantidad, ajustar la función `spans()` en `ServicesGrid.astro`.

## 6. Páginas

| Ruta | Archivo |
| --- | --- |
| `/` | `pages/index.astro` |
| `/nosotros/` | `pages/nosotros.astro` |
| `/servicios/` | `pages/servicios/index.astro` |
| `/servicios/[slug]/` | `pages/servicios/[slug].astro` |
| `/flota/` | `pages/flota.astro` |
| `/como-funciona/` | `pages/como-funciona.astro` |
| `/contacto/` | `pages/contacto.astro` (sin formulario) |
| 404 | `pages/404.astro` |

Las rutas están centralizadas en `src/lib/site.js` (`routes`). El orden de ese objeto define el orden del menú.

## 7. Guías rápidas de contenido

### Agregar un vehículo
Agregar un objeto a `flota.items` con `nombre`, `modelo`, `categoria`, `capacidad`, `equipaje`, `caracteristicas` (2 o 3), `imagen` e `imagenAlt`. Todas las imágenes se recortan al mismo formato 3:2, así que conviene usar fotos horizontales con el vehículo centrado.

### Agregar un testimonio
Agregar a `testimonios.items`:
```json
{ "nombre": "Nombre Apellido", "estrellas": 5, "comentario": "Texto de la reseña.", "fecha": "Septiembre 2026" }
```
`estrellas` va de 1 a 5. El carrusel se ajusta solo. Los testimonios actuales son **de ejemplo** y deben reemplazarse por reseñas reales antes de publicar.

### Modificar datos de contacto
Editar `site.telefono`, `site.email`, `site.whatsapp` (solo dígitos con código de país, sin `+`), `site.whatsappVisible` y `site.horario`. Se actualizan el header, el footer, la página de contacto, el botón flotante, los CTA de WhatsApp y el JSON-LD.
El mensaje prellenado de WhatsApp está en `site.whatsappMensaje` y, en cada servicio, en `servicios.whatsappMensaje`.

## 8. Animaciones

Todas las animaciones son lentas y sutiles (fade + desplazamiento de 24-32 px, curvas `power2.out` y `cubic-bezier(.22,.61,.36,1)`). No hay rebotes, giros ni flashes.

### GSAP + ScrollTrigger (`src/scripts/motion.js`)
Se activan con atributos en el HTML:

| Atributo | Efecto |
| --- | --- |
| `data-hero-item` | Entrada escalonada al cargar la página (hero y cabeceras). |
| `data-reveal` | El elemento aparece al entrar en pantalla. |
| `data-reveal-stagger` | Los hijos directos aparecen uno tras otro. |
| `data-parallax` | Parallax vertical suave (12 %) de la imagen del hero. |

Cada elemento tiene una sola animación: no se combinan `data-reveal` y `data-reveal-stagger` sobre el mismo nodo.

**Estado inicial seguro:** un script inline en `<head>` agrega la clase `motion-ok` al `<html>`. Solo con esa clase, el CSS oculta los elementos animables. Si el usuario activó *reducir movimiento*, la clase no se agrega. Si el script de animaciones no carga en 3 segundos, la clase se quita y el contenido se muestra igual.

### Lenis (smooth scroll)
Se instancia **una única vez** en `motion.js`, que el `Layout.astro` importa. Por eso ninguna página crea su propia instancia. Está sincronizado con ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`) y usa el ticker de GSAP. Queda disponible como `window.lenis`, y el menú móvil lo pausa (`stop()`) mientras está abierto. Con *reducir movimiento*, Lenis no se inicializa.

### Framer Motion
Se usa dentro de la isla `MobileMenu.jsx` para la entrada escalonada de los enlaces. Se carga con `LazyMotion` + `domAnimation`, que solo incluye lo necesario, y respeta `reducedMotion="user"`. No existía un `Reveal.jsx` previo; para las entradas por scroll se usa GSAP, así no se duplican librerías sobre los mismos elementos.

## 9. Imágenes

- Las fotos están en `src/assets/images/` y se muestran con `<Image />` de Astro, que en el build genera versiones **WebP en varios anchos** con `srcset` y `sizes`.
- `src/lib/images.js` usa `import.meta.glob` para convertir el nombre de archivo de `content.json` en la imagen importada.
- **La imagen del hero** (y la de cabecera de cada página) se carga con `loading="eager"` y `fetchpriority="high"`. El resto usa lazy loading (el comportamiento por defecto de `<Image />`).
- En los carruseles React, las imágenes se optimizan en Astro con `getImage()` y se pasan ya resueltas como props.
- **No se usan imágenes remotas**: las fotos de Unsplash se descargaron al proyecto con `scripts/fetch-stock-images.mjs`, que registra autor e ID de cada una. Así no hace falta habilitar dominios remotos en Astro ni en la CSP, y el sitio no depende de servicios externos. No se usa `source.unsplash.com`.
- Las imágenes dentro de tarjetas-enlace (servicios) tienen `alt=""` porque son decorativas: el nombre del servicio ya describe el enlace y así un lector de pantalla no repite información. Las demás imágenes tienen `alt` descriptivo en `content.json`.
- La foto `hero-suv.jpg` es la imagen original del cliente (`auto-lujo-mobility.jpg`).

### Marca y favicon
`scripts/brand-assets.mjs` procesa los archivos originales del cliente, que están en la raíz del proyecto:

- `logo-Lujo-Mobility.jpg` → `src/assets/brand/logo-lujo-mobility.png`: se quita el fondo blanco y se conserva el efecto plateado para fondos oscuros. Se usa en header, footer y menú móvil.
- `logo-De-Ventana.jpg` → `public/favicon.ico` (16/32/48), `public/favicon.png` y `public/apple-touch-icon.png` (con fondo negro, ya que iOS no admite transparencia). El JPG original traía un damero simulando transparencia, por eso se recorta el emblema con una máscara circular.
- `public/og-image.jpg`: foto del hero con el logo, para compartir en redes.

`home-lujo-mobility.jpg` es la referencia de diseño y no se publica.

## 10. SEO

- `Layout.astro` recibe `title`, `description`, `ogTitle`, `ogDescription`, `ogImage`, `canonical`, `noindex` y `jsonLd`. No hay `<title>` fijo.
- Cada página toma sus metadatos de `content.json → seo`. Las páginas de servicio usan el nombre y la descripción de cada servicio, más su propia foto como `og:image` (1200×630).
- La URL canónica se calcula con `site.url` y siempre termina en `/`, igual que el sitemap y la configuración de Vercel.
- La 404 lleva `noindex` y no tiene canonical.

## 11. Sitemap y robots

- `@astrojs/sitemap` genera `sitemap-index.xml` y `sitemap-0.xml` en el build a partir de `site` (definido en `astro.config.mjs` con `content.site.url`). La 404 queda excluida.
- `public/robots.txt` permite todo y referencia `sitemap-index.xml`. **Al cambiar el dominio, actualizar la URL de ese archivo.**
- Versión de `@astrojs/sitemap` fijada en **3.2.1**, la última compatible con Astro 4 sin arrastrar APIs de Astro 5.

## 12. JSON-LD

La home incluye `LocalBusiness` con nombre, descripción, URL, teléfono, email, imagen, área de servicio (Lima y Callao), horario 24/7 y dirección con **solo localidad y país** (`Lima`, `PE`). No se inventa una dirección física: si el cliente la entrega, se puede agregar `streetAddress` en `index.astro` desde `content.json`.

## 13. Página 404

`src/pages/404.astro` reutiliza el Layout, el Header, el Footer, la tipografía y la paleta, y ofrece volver al inicio o ver servicios. Astro la genera como `dist/404.html`, que Vercel (y la mayoría de hostings estáticos) sirve automáticamente con código 404 para cualquier ruta inexistente.

**Directorios:** Vercel no ofrece listado de directorios. Una ruta como `/fotos/` sin `index.html` devuelve la 404 personalizada, mientras que los archivos reales (`/og-image.jpg`, `/_astro/*.webp`) se sirven normalmente. En otros servidores:

- **Nginx**: `autoindex off;` (valor por defecto) y `error_page 404 /404.html;`
- **Apache**: `Options -Indexes` y `ErrorDocument 404 /404.html` en `.htaccess`
- **Netlify / Cloudflare Pages**: usan `404.html` automáticamente y no listan directorios.

## 14. Headers de seguridad

Al ser un sitio estático, **Astro no envía headers HTTP**: los aplica el servidor. Están definidos en `vercel.json` para todas las rutas:

| Header | Valor |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

Notas sobre la CSP:

- `script-src 'unsafe-inline'` es necesario porque Astro inserta scripts inline para hidratar las islas React, y además hay un script inline mínimo en `<head>` para las animaciones. Se podría endurecer reemplazándolo por hashes SHA-256 de esos scripts, pero cambian con cada versión de Astro. Para una demo se priorizó la estabilidad.
- `style-src 'unsafe-inline'` cubre los estilos inline de las islas y la variable de color de los logos placeholder.
- Todo (fuentes, imágenes y scripts) se sirve desde el mismo dominio, por lo que no hay dominios externos permitidos. Los enlaces a WhatsApp (`wa.me`) son navegaciones normales y no requieren permisos en la CSP.
- Si se publica fuera de Vercel, replicar estos headers en la configuración del servidor (`_headers` en Netlify/Cloudflare, `add_header` en Nginx, `Header set` en Apache). **En `npm run dev` y `npm run preview` estos headers no se aplican.**

## 15. Decisiones de arquitectura

**¿Por qué Astro?** Da muy buen rendimiento en sitios institucionales: genera HTML estático, envía JavaScript solo donde hace falta y permite usar React en componentes puntuales.

**¿Por qué separar Astro y React?** Para no hidratar la página entera. El 95 % del sitio es contenido estático. Solo el menú móvil y los carruseles cargan React, y lo hacen de forma diferida (`client:media`, `client:visible`).

**¿Por qué Embla?** Es un motor de carrusel liviano, sin estilos impuestos y con buen soporte táctil. El diseño queda 100 % en Tailwind.

**¿Por qué GSAP + ScrollTrigger?** Ofrecen control fino sobre las animaciones de scroll y el parallax (curvas, escalonado, sincronización con Lenis), algo que las animaciones CSS no resuelven bien.

**¿Por qué Lenis?** Da un scroll suave y consistente entre navegadores, que refuerza la sensación premium. Se desactiva con *reducir movimiento*.

**¿Por qué centralizar el contenido?** Para que el cliente o un editor cambie textos, servicios o datos de contacto en un solo archivo, sin buscar dentro de los componentes y sin riesgo de romper el código.

**¿Por qué shadcn/ui + Radix solo en el menú móvil?** Radix resuelve la accesibilidad difícil (foco atrapado, Escape, `aria-*`) del panel lateral y del acordeón. Para botones y enlaces bastan clases CSS propias, lo que mantiene la identidad visual y evita un aspecto de template.

**¿Por qué el dropdown de servicios es CSS + un script mínimo?** Se abre con hover y con foco de teclado (`:hover` / `:focus-within`) sin React. El script solo actualiza `aria-expanded` y permite cerrar con Escape.

**Iconos de marca:** `lucide-react` no incluye logos de marcas, así que WhatsApp, Instagram, LinkedIn y Facebook son SVG inline en `BrandIcon.astro`. El resto de los iconos son de lucide.

**Idioma:** los textos están en español neutro con tuteo, habitual en Perú (por ejemplo, "También puedes consultar").

**Compatibilidad de versiones:** Astro 4.16 + `@astrojs/react` 3.x + React 18.3 + Tailwind CSS 4 (plugin `@tailwindcss/vite`, compatible con el Vite 5 de Astro 4) + `@astrojs/sitemap` 3.2.1 + Framer Motion 11.

**Mapas (a futuro):** si se necesita mostrar zonas de cobertura, se podría integrar Leaflet (sin API key) o Google Maps como isla con `client:visible`. Eso implica agregar sus dominios a la CSP. No está implementado.

## 16. Créditos de imágenes

Las fotografías referenciales provienen de [Unsplash](https://unsplash.com) (licencia Unsplash). El listado completo con autor e ID está en `scripts/fetch-stock-images.mjs`. Antes de publicar en producción, se recomienda reemplazarlas por fotos propias de la flota.

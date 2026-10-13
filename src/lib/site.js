// Rutas del sitio y helpers de datos derivados de content.json (navegación, enlaces de contacto).
import content from '../content.json';

export const routes = {
  inicio: '/',
  nosotros: '/nosotros/',
  servicios: '/servicios/',
  flota: '/flota/',
  comoFunciona: '/como-funciona/',
  contacto: '/contacto/',
};

export const navItems = Object.entries(routes).map(([key, href]) => ({
  key,
  href,
  label: content.navigation[key],
}));

export const services = content.servicios.items;

export const serviceUrl = (slug) => `${routes.servicios}${slug}/`;

export const whatsappUrl = (message = content.site.whatsappMensaje) =>
  `https://wa.me/${content.site.whatsapp}?text=${encodeURIComponent(message)}`;

export const emailUrl = `mailto:${content.site.email}`;

export const isActive = (href, pathname) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

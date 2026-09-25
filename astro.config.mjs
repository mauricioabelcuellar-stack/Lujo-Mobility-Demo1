// Configuración de Astro: React como islas, Tailwind CSS v4 (plugin de Vite) y sitemap.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import content from './src/content.json';

export default defineConfig({
  // La URL pública se define una sola vez en content.json (site.url).
  site: content.site.url,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

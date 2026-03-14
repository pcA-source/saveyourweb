import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://saveyourweb.fr',
  output: 'static',
  integrations: [sitemap({
    filter: (page) => 
      !page.includes('/devis/') && 
      !page.includes('/mentions-legales') && 
      !page.includes('/politique-de-confidentialite'),
    serialize(item) {
      item.lastmod = new Date().toISOString().split('T')[0];
      return item;
    },
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
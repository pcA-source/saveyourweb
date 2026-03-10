import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://saveyourweb.fr',
  output: 'static',
  integrations: [sitemap({
    filter: (page) => !page.includes('/devis/'),
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
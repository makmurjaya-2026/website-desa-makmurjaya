import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://makmurjaya-2026.github.io',
  base: '/website-desa-makmurjaya/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  image: {
    domains: [],
    remotePatterns: [],
  },
  build: {
    assets: '_astro',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            leaflet: ['leaflet'],
          },
        },
      },
    },
  },
});

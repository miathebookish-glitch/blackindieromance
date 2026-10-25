import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { NOINDEX_PATHS } from './src/lib/noindex.mjs';

export default defineConfig({
  site: 'https://blackindieromance.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((p) => page.endsWith(p)),
    }),
  ],
});

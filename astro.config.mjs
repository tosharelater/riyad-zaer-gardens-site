// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const pages = process.env.GITHUB_PAGES === 'true';
const repo = 'riyad-zaer-gardens-site';

// https://astro.build/config
export default defineConfig({
  site: pages ? `https://tosharelater.github.io/${repo}` : undefined,
  base: pages ? `/${repo}` : '/',
  trailingSlash: 'always',
  redirects: {
    '/typologies/': '/projet/',
    '/equipements/': '/projet/',
    '/chantier/': '/projet/',
    '/a-propos/': '/projet/',
    '/aides/': '/contact/',
    '/faq/': '/contact/',
    '/blog/': '/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
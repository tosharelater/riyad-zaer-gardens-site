// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const pages = process.env.GITHUB_PAGES === 'true';
const repo = 'riyad-zaer-gardens-site';

// https://astro.build/config
export default defineConfig({
  site: pages ? `https://tosharelater.github.io/${repo}` : undefined,
  base: pages ? `/${repo}` : '/',
  trailingSlash: 'ignore',
  redirects: {
    '/typologies': '/projet/',
    '/typologies/': '/projet/',
    '/equipements': '/projet/',
    '/equipements/': '/projet/',
    '/chantier': '/projet/',
    '/chantier/': '/projet/',
    '/a-propos': '/projet/',
    '/a-propos/': '/projet/',
    '/aides': '/contact/',
    '/aides/': '/contact/',
    '/faq': '/contact/',
    '/faq/': '/contact/',
    '/blog': '/',
    '/blog/': '/',
    '/design-system': '/',
    '/design-system/': '/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
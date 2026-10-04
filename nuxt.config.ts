import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          // Code blocks have a dark background in both color modes.
          theme: 'github-dark',
          langs: ['js', 'ts', 'vue', 'json', 'bash', 'css', 'html', 'yaml', 'md', 'python', 'go', 'sql', 'xml', 'ini'],
        },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [],
    },
  },
  compatibilityDate: '2025-07-15',
  site: {
    url: 'https://rajeev.dev',
    name: 'Rajeev R Sharma',
  },
  sitemap: {
    zeroRuntime: true,
    sitemapsPathPrefix: '/sitemap',
  },
  routeRules: {
    '/series/python-turtle-puzzle-game': {
      redirect: {
        to: '/creating-puzzle-game-using-python-turtle-1',
        statusCode: 301,
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Rajeev R Sharma',
      meta: [
        { name: 'theme-color', content: '#fafaf9', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' },
        { property: 'og:site_name', content: 'Rajeev R Sharma' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: 'https://rajeev.dev/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Rajeev R Sharma — I build useful web apps and write about the decisions behind them.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@ra_jeeves' },
        { name: 'twitter:creator', content: '@ra_jeeves' },
        { name: 'twitter:image', content: 'https://rajeev.dev/og.png' },
        { name: 'author', content: 'Rajeev R Sharma' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Rajeev R Sharma RSS', href: '/rss.xml' },
      ],
    },
  },
  nitro: {
    preset: 'cloudflare-module',
    // Server caches (like the WDYGDT feed) live in KV, so a stale copy survives Worker restarts.
    storage: {
      cache: {
        driver: 'cloudflare-kv-binding',
        binding: 'CACHE',
      },
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      routes: [
        '/',
        '/robots.txt',
        '/rss.xml',
      ],
    },
  },
})

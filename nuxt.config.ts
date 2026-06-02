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
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Rajeev R Sharma',
      meta: [
        { name: 'theme-color', content: '#fafaf9', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' },
        { property: 'og:site_name', content: 'Rajeev R Sharma' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Rajeev R Sharma RSS', href: '/rss.xml' },
      ],
    },
  },
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      routes: [
        '/',
        '/rss.xml',
      ],
    },
  },
})

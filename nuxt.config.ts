import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
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
      titleTemplate: '%s · Rajeev',
      meta: [
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'Rajeev RSS', href: '/rss.xml' },
      ],
    },
  },
   nitro: {
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      routes: [
        '/',
      ],
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-04-03',
  site: {
    url: 'https://rajeev.dev',
    name: 'Rajeev',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Rajeev',
      meta: [
        { name: 'theme-color', content: '#f8fafc' },
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'Rajeev RSS', href: '/rss.xml' },
      ],
    },
  },
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://rajeev.dev/sitemap.xml',
  },
})

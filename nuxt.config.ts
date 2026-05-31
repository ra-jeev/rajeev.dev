import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/content',
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
  compatibilityDate: '2024-04-03',
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  site: {
    url: 'https://rajeev.dev',
    name: 'Rajeev',
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
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ],
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

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },

  typescript: {
    strict: true,
  },

  devtools: {
    enabled: true,
  },
})
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/scripts', '@nuxt/fonts'],
  fonts: {
    families: [
      {
        name: 'Noto Sans JP',
        provider: 'google',
        weights: [100,200,300,400,500,600,700,800,900,1000]
      },
      {
        name: 'Inter',
        provider: 'google',
        weights: [100,200,300,400,500,600,700,800,900,1000]
      },
      {
        name: 'IBM Plex Sans JP',
        provider: 'google',
        weights: [400]
      }
    ]
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  runtimeConfig: {
    public: {
      apiUrl: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },
})
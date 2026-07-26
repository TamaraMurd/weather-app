export default defineNuxtConfig({
  srcDir: 'app/',   // ← додај го ова

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      weatherApiKey: process.env.NUXT_PUBLIC_WEATHER_API_KEY || '',
    },
  },
})
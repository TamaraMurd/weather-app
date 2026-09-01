export default defineNuxtConfig({
  srcDir: 'app/',   

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      weatherApiKey: process.env.NUXT_PUBLIC_WEATHER_API_KEY || '',
    },
  },
})
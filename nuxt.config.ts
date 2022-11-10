// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/tailwind.css"],
  buildModules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt"
  ],
  nitro: {
    externals: {
      inline: ["uuid"]
    }
  }
})

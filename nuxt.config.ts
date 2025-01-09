export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
    }
  },
  modules: ['nuxt-icon']
})

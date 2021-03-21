<template>
  <div>
    <TheHeader />

    <main class="container mx-auto px-4 lg:px-8">
      <div class="flex flex-wrap relative">
        <Nuxt />
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script>
export default {
  head() {
    const i18nSeo = this.$nuxtI18nSeo()

    return {
      ...i18nSeo,
    }
  },
}
</script>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.page as string
const { data: page } = await useAsyncData(`page-${slug}`, () => queryCollection('pages').path(`/pages/${slug}`).first())

if (!page.value || slug === 'index')
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada', fatal: true })

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
})
defineOgImage('Post', { title: page.value.title, description: page.value.description })
</script>

<template>
  <div v-if="page" class="container-text">
    <h1 class="text-3xl font-bold tracking-tight mb-8">
      {{ page.title }}
    </h1>
    <div class="prose">
      <ContentRenderer :value="page" />
    </div>
  </div>
</template>

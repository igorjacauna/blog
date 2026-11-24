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
    <h1 class="font-serif text-[3.2rem] leading-none mb-8">
      {{ page.title }}
    </h1>
    <div class="prose">
      <ContentRenderer :value="page" />
    </div>
    <p v-if="page.note" class="hand-note mt-6 -rotate-2 origin-left">
      {{ page.note }}
    </p>
  </div>
</template>

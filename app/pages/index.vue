<script setup lang="ts">
const { data: page } = await useAsyncData('page-index', () => queryCollection('pages').path('/pages').first())
const { data: posts } = await usePostsQuery(5)

useSeoMeta({
  title: 'Igor Jacaúna',
  description: page.value?.description,
  ogTitle: 'Igor Jacaúna',
  ogDescription: page.value?.description,
})
defineOgImage('Post', { title: 'Igor Jacaúna', description: 'Dev frontend em Manaus. Vue, Nuxt, React e open source.' })
</script>

<template>
  <div class="container-text">
    <section class="pt-6 pb-4">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
        Igor Jacaúna
      </h1>
      <div class="prose">
        <ContentRenderer v-if="page" :value="page" />
      </div>
      <p class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
        <a href="https://github.com/igorjacauna" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1.5"><span class="i-simple-icons-github" /> GitHub</a>
        <a href="https://www.linkedin.com/in/igorjacauna/" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1.5"><span class="i-simple-icons-linkedin" /> LinkedIn</a>
        <a href="/feed.xml" class="link-muted inline-flex items-center gap-1.5"><span class="i-ph-rss-simple" /> RSS</a>
      </p>
    </section>

    <section class="mt-14">
      <div class="flex items-baseline justify-between mb-3">
        <h2 class="text-sm uppercase tracking-widest text-[var(--fg-faint)] font-semibold">
          Posts recentes
        </h2>
        <NuxtLink to="/posts" class="text-sm link-muted">
          Todos os posts →
        </NuxtLink>
      </div>
      <PostList v-if="posts" :posts="posts" />
    </section>
  </div>
</template>

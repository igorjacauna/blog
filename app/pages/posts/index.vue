<script setup lang="ts">
const { data: posts } = await usePostsQuery()

useSeoMeta({
  title: 'Posts',
  description: 'Tudo o que já escrevi sobre Vue, Nuxt, React, ferramentas e projetos pessoais.',
})
defineOgImage('Post', { title: 'Posts', description: 'Vue, Nuxt, React, ferramentas e projetos pessoais.' })
</script>

<template>
  <div class="container-text">
    <h1 class="text-3xl font-bold tracking-tight mb-2">
      Posts
    </h1>
    <p class="text-[var(--fg-muted)] mb-10">
      Também dá para acompanhar pelo <a href="/feed.xml" class="underline decoration-[var(--border-strong)] underline-offset-3 hover:text-[var(--fg)]">RSS</a>.
    </p>
    <PostList v-if="posts" :posts="posts" group-by-year />
  </div>
</template>

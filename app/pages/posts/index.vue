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
    <h1 class="font-serif text-[3.2rem] leading-none mb-3">
      Posts
    </h1>
    <p class="text-[var(--fg-muted)] mb-12">
      Tudo o que já escrevi, do mais novo ao mais antigo. <span class="hand-note text-[1.4rem] inline-block -rotate-1">dá pra seguir pelo <a href="/feed.xml" class="underline underline-offset-4">RSS</a></span>
    </p>
    <PostList v-if="posts" :posts="posts" group-by-year />
  </div>
</template>

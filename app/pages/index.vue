<script setup lang="ts">
const { data: page } = await useAsyncData('page-index', () => queryCollection('pages').path('/pages').first())
const { data: posts } = await usePostsQuery(5)
const { data: projects } = await useAsyncData('projects-home', () => queryCollection('projects').first())

const featured = computed(() => projects.value?.groups.flatMap(group => group.items).slice(0, 3) ?? [])

useSeoMeta({
  title: 'Igor Jacaúna',
  description: page.value?.description,
  ogTitle: 'Igor Jacaúna',
  ogDescription: page.value?.description,
})
defineOgImage('Post', { title: 'Oi, eu sou o Igor.', description: 'Dev frontend em Manaus. Vue, Nuxt, React e open source.' })
</script>

<template>
  <div class="container-text">
    <section class="hero pt-10 pb-6 flex flex-wrap items-center gap-12">
      <div class="flex-[999_1_420px] min-w-0">
        <h1 class="font-serif text-[3.4rem] sm:text-[4.4rem] leading-[1.02] m-0">
          Oi, eu sou o
          <span class="circled">Igor<svg aria-hidden="true" viewBox="0 0 200 90" preserveAspectRatio="none"><path d="M18,48 C14,18 70,6 118,8 C170,10 196,30 190,52 C184,78 120,88 74,84 C30,80 6,66 14,40 C20,24 52,14 88,12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg></span>.
        </h1>
        <div class="prose mt-7 text-[1.15rem]">
          <ContentRenderer v-if="page" :value="page" />
        </div>
        <p v-if="page?.note" class="hand-note mt-4 -rotate-2 origin-left">
          {{ page.note }}
        </p>
      </div>
      <figure v-if="page?.doodle" class="doodle flex-[1_1_240px] m-0 flex flex-col items-center gap-2">
        <img :src="page.doodle" :alt="page.doodleCaption || 'Um rabisco do Igor'" class="w-full max-w-[300px]">
        <figcaption v-if="page.doodleCaption" class="font-hand text-[1.4rem] text-[var(--fg-faint)]">
          {{ page.doodleCaption }}
        </figcaption>
      </figure>
    </section>

    <section class="mt-16">
      <div class="flex items-baseline flex-wrap gap-x-4 mb-2">
        <h2 class="font-serif text-[2.5rem] m-0">
          Últimos posts
        </h2>
        <span class="hand-note text-[1.5rem]">← comece por aqui</span>
        <NuxtLink to="/posts" class="ml-auto text-sm link-muted">
          Todos os posts →
        </NuxtLink>
      </div>
      <PostList v-if="posts" :posts="posts" />
    </section>

    <section v-if="featured.length" class="mt-20">
      <div class="flex items-baseline flex-wrap gap-x-4 mb-6">
        <h2 class="font-serif text-[2.5rem] m-0">
          Coisas que construí
        </h2>
        <NuxtLink to="/projetos" class="ml-auto text-sm link-muted">
          Todos os projetos →
        </NuxtLink>
      </div>
      <div class="grid gap-5 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <ProjectCard v-for="item in featured" :key="item.name" :project="item" compact />
      </div>
    </section>
  </div>
</template>

<style scoped>
.circled {
  position: relative;
  display: inline-block;
  padding: 0 6px;
}
.circled svg {
  position: absolute;
  left: -14px;
  top: -8px;
  width: calc(100% + 28px);
  height: calc(100% + 16px);
  overflow: visible;
  color: var(--accent);
  stroke-dasharray: 520;
  stroke-dashoffset: 520;
  animation: draw 1.1s 0.3s ease-out forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .circled svg { animation: none; stroke-dashoffset: 0; }
}
.doodle img {
  transform: rotate(2deg);
}
</style>

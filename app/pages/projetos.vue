<script setup lang="ts">
const { data } = await useAsyncData('projects', () => queryCollection('projects').first())

useSeoMeta({
  title: 'Projetos',
  description: 'Ferramentas, layers e experimentos open source que publiquei, e contribuições em projetos do ecossistema UnJS.',
})
defineOgImage('Post', { title: 'Projetos', description: 'Ferramentas, experimentos e contribuições open source.' })
</script>

<template>
  <div class="container-text">
    <h1 class="font-serif text-[3.2rem] leading-none mb-3">
      Projetos
    </h1>
    <p class="text-[var(--fg-muted)] mb-12">
      Coisas que construí para resolver um problema meu e deixei abertas. Todas estão no <a href="https://github.com/igorjacauna" target="_blank" rel="noopener" class="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--fg)]">GitHub</a>.
    </p>

    <template v-if="data">
      <section v-for="group in data.groups" :key="group.title" class="mb-12">
        <h2 class="hand-note text-[2rem] mb-5 -rotate-1 origin-left">
          {{ group.title }}
        </h2>
        <div class="grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          <ProjectCard v-for="item in group.items" :key="item.name" :project="item" />
        </div>
      </section>

      <section class="mb-6">
        <h2 class="hand-note text-[2rem] mb-3 -rotate-1 origin-left">
          Contribuições
        </h2>
        <ul class="flex flex-col gap-1">
          <li v-for="c in data.contributions" :key="c.url">
            <a :href="c.url" target="_blank" rel="noopener" class="group flex flex-col sm:flex-row sm:items-baseline gap-x-3 py-1.5">
              <span class="font-mono text-sm text-[var(--fg-muted)] whitespace-nowrap">{{ c.repo }}</span>
              <span class="text-[var(--fg)]"><span class="marker-hover">{{ c.title }}</span></span>
            </a>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.marker-hover {
  background: linear-gradient(transparent 55%, var(--marker) 55%) no-repeat left / 0% 100%;
  transition: background-size 0.35s ease;
}
a:hover .marker-hover,
a:focus-visible .marker-hover {
  background-size: 100% 100%;
}
</style>

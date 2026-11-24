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
    <h1 class="text-3xl font-bold tracking-tight mb-2">
      Projetos
    </h1>
    <p class="text-[var(--fg-muted)] mb-12">
      Coisas que construí para resolver um problema meu e deixei abertas. Todas estão no <a href="https://github.com/igorjacauna" target="_blank" rel="noopener" class="underline decoration-[var(--border-strong)] underline-offset-3 hover:text-[var(--fg)]">GitHub</a>.
    </p>

    <template v-if="data">
      <section v-for="group in data.groups" :key="group.title" class="mb-12">
        <h2 class="text-sm uppercase tracking-widest text-[var(--fg-faint)] font-semibold mb-4">
          {{ group.title }}
        </h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <a v-for="item in group.items" :key="item.name" :href="item.url" target="_blank" rel="noopener" class="project group">
            <span class="flex items-center gap-2 font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
              <span v-if="item.icon" :class="item.icon" class="opacity-70" />
              {{ item.name }}
            </span>
            <span class="text-sm text-[var(--fg-muted)] leading-relaxed">{{ item.description }}</span>
            <code v-if="item.npm" class="text-xs text-[var(--fg-faint)] mt-auto pt-1">npm i {{ item.npm }}</code>
          </a>
        </div>
      </section>

      <section class="mb-6">
        <h2 class="text-sm uppercase tracking-widest text-[var(--fg-faint)] font-semibold mb-4">
          Contribuições
        </h2>
        <ul class="flex flex-col gap-1">
          <li v-for="c in data.contributions" :key="c.url">
            <a :href="c.url" target="_blank" rel="noopener" class="group flex flex-col sm:flex-row sm:items-baseline gap-x-3 py-1.5">
              <span class="font-mono text-sm text-[var(--fg-muted)] whitespace-nowrap">{{ c.repo }}</span>
              <span class="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{{ c.title }}</span>
            </a>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  transition: border-color 0.2s, background-color 0.2s;
}
.project:hover {
  border-color: var(--border-strong);
  background: var(--bg-soft);
}
</style>

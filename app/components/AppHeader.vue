<script setup lang="ts">
const links = [
  { to: '/posts', label: 'Posts' },
  { to: '/projetos', label: 'Projetos' },
  { to: '/sobre', label: 'Sobre' },
]
</script>

<template>
  <header class="container-text flex items-center justify-between gap-4 py-8">
    <NuxtLink to="/" class="font-semibold tracking-tight text-[var(--fg)]" aria-label="Página inicial">
      igor jacaúna
    </NuxtLink>
    <nav class="flex items-center gap-4 sm:gap-5 text-[0.95rem]">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="link-muted" active-class="!text-[var(--fg)]">
        {{ link.label }}
      </NuxtLink>
      <a href="/feed.xml" class="link-muted hidden sm:inline-flex" title="RSS" aria-label="RSS">
        <span class="i-ph-rss-simple" />
      </a>
      <a href="https://github.com/igorjacauna" class="link-muted hidden sm:inline-flex" title="GitHub" aria-label="GitHub" target="_blank" rel="noopener">
        <span class="i-simple-icons-github" />
      </a>
      <ThemeToggle />
    </nav>
  </header>
</template>

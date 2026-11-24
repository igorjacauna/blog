<script setup lang="ts">
const links = [
  { to: '/posts', label: 'Posts' },
  { to: '/projetos', label: 'Projetos' },
  { to: '/sobre', label: 'Sobre' },
]
</script>

<template>
  <header class="container-text flex items-center justify-between flex-wrap gap-4 py-8">
    <NuxtLink to="/" class="font-hand text-[2rem] font-bold leading-none text-[var(--fg)]" aria-label="Página inicial">
      igor jacaúna
    </NuxtLink>
    <nav class="flex items-center gap-4 sm:gap-6 text-[0.95rem]">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link link-muted" active-class="is-active">
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

<style scoped>
.nav-link {
  position: relative;
}
.nav-link.is-active {
  color: var(--fg);
}
/* Sublinhado "à mão" no item ativo */
.nav-link.is-active::after {
  content: '';
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -6px;
  height: 6px;
  background: no-repeat center / 100% 100% url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'%3E%3Cpath d='M1 4 C 25 1, 50 5, 75 2 S 99 3, 99 3' fill='none' stroke='%232442c4' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}
:global(html.dark) .nav-link.is-active::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'%3E%3Cpath d='M1 4 C 25 1, 50 5, 75 2 S 99 3, 99 3' fill='none' stroke='%2393a6ff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}
</style>

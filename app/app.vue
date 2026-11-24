<script setup lang="ts">
useSeoMeta({
  titleTemplate: t => (t && t !== 'Igor Jacaúna' ? `${t} · Igor Jacaúna` : 'Igor Jacaúna'),
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
useSeoMeta({ title: props.error.statusCode === 404 ? 'Página não encontrada' : 'Erro' })
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 container-text py-16">
      <p class="text-7xl font-extrabold text-[var(--border-strong)]">
        {{ error.statusCode }}
      </p>
      <h1 class="text-2xl font-bold mt-4 mb-6">
        {{ error.statusCode === 404 ? 'Essa página não existe (ou mudou de lugar).' : 'Algo deu errado.' }}
      </h1>
      <NuxtLink to="/posts" class="link-muted underline underline-offset-3" @click="clearError({ redirect: '/posts' })">
        Ver todos os posts →
      </NuxtLink>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle(event: MouseEvent) {
  const next = isDark.value ? 'light' : 'dark'
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    colorMode.preference = next
    return
  }
  const x = event.clientX
  const y = event.clientY
  document.documentElement.style.setProperty('--vt-x', `${x}px`)
  document.documentElement.style.setProperty('--vt-y', `${y}px`)
  doc.startViewTransition(() => {
    colorMode.preference = next
  })
}
</script>

<template>
  <button type="button" class="link-muted inline-flex" :title="isDark ? 'Tema claro' : 'Tema escuro'" aria-label="Alternar tema" @click="toggle">
    <ClientOnly>
      <span :class="isDark ? 'i-ph-sun' : 'i-ph-moon'" />
      <template #fallback>
        <span class="i-ph-moon" />
      </template>
    </ClientOnly>
  </button>
</template>

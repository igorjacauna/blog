<script setup lang="ts">
defineProps<{
  project: { name: string, description: string, url: string, icon?: string, npm?: string }
  compact?: boolean
}>()
</script>

<template>
  <a :href="project.url" target="_blank" rel="noopener" class="project-card">
    <span class="flex items-center gap-2 font-semibold text-[1.05rem] text-[var(--fg)]">
      <span v-if="project.icon" :class="project.icon" class="text-[var(--accent)]" />
      {{ project.name }}
    </span>
    <span class="text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">{{ project.description }}</span>
    <code v-if="project.npm && !compact" class="text-xs text-[var(--fg-faint)] mt-auto pt-1">npm i {{ project.npm }}</code>
  </a>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1.25rem 1.35rem;
  background: var(--card);
  border: 1.5px solid var(--card-border);
  border-radius: 4px;
  box-shadow: 4px 4px 0 var(--shadow);
  transform: rotate(-0.8deg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.project-card:nth-child(3n+2) { transform: rotate(0.7deg); }
.project-card:nth-child(3n+3) { transform: rotate(-0.4deg); }
.project-card:hover,
.project-card:focus-visible {
  transform: rotate(0) translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--accent);
}
</style>

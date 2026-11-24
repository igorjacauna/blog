<script setup lang="ts">
interface PostItem {
  path: string
  title: string
  date: string | Date
  readingTime?: number
}

const props = defineProps<{ posts: PostItem[], groupByYear?: boolean }>()

const groups = computed(() => {
  if (!props.groupByYear)
    return [{ year: null as number | null, posts: props.posts }]
  const map = new Map<number, PostItem[]>()
  for (const post of props.posts) {
    const year = yearOf(post.date)
    if (!map.has(year))
      map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].map(([year, posts]) => ({ year, posts }))
})
</script>

<template>
  <div>
    <section v-for="group in groups" :key="group.year ?? 'all'" class="relative">
      <div v-if="group.year" class="year select-none pointer-events-none" aria-hidden="true">
        {{ group.year }}
      </div>
      <h2 v-if="group.year" class="sr-only">
        {{ group.year }}
      </h2>
      <ul class="relative flex flex-col gap-1" :class="group.year ? 'pt-14 pb-8' : ''">
        <li v-for="post in group.posts" :key="post.path">
          <NuxtLink :to="post.path" class="post-row group flex flex-col sm:flex-row sm:items-baseline gap-x-3 gap-y-0.5 py-2">
            <span class="text-[1.05rem] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{{ post.title }}</span>
            <span class="text-sm text-[var(--fg-faint)] whitespace-nowrap tabular-nums">
              {{ formatShortDate(post.date) }}<template v-if="post.readingTime"> · {{ post.readingTime }} min</template>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.year {
  position: absolute;
  top: -0.5rem;
  left: -1.5rem;
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--border-strong);
  opacity: 0.55;
}
@media (max-width: 640px) {
  .year { left: -0.25rem; font-size: 5rem; }
}
</style>

<script setup lang="ts">
interface PostItem {
  path: string
  title: string
  date: string | Date
  readingTime?: number
}

const props = defineProps<{ posts: PostItem[], groupByYear?: boolean }>()

function meta(post: PostItem) {
  const parts = [props.groupByYear ? formatShortDate(post.date) : `${formatShortDate(post.date)} ${yearOf(post.date)}`]
  if (post.readingTime)
    parts.push(`${post.readingTime} min`)
  return parts.join(' · ')
}

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
    <section v-for="group in groups" :key="group.year ?? 'all'" :class="group.year ? 'mb-10' : ''">
      <h2 v-if="group.year" class="year font-hand">
        {{ group.year }}
      </h2>
      <ul>
        <li v-for="post in group.posts" :key="post.path">
          <NuxtLink :to="post.path" class="post-row group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 py-4 border-b border-[var(--border)]">
            <span class="text-[1.2rem] font-medium text-[var(--fg)]">
              <span class="title">{{ post.title }}</span>
            </span>
            <span class="font-hand text-[1.35rem] text-[var(--fg-faint)] whitespace-nowrap">
              {{ meta(post) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.year {
  margin: 0 0 0.25rem;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--accent);
  transform: rotate(-2deg);
  transform-origin: left;
  display: inline-block;
}
.title {
  background: linear-gradient(transparent 55%, var(--marker) 55%) no-repeat left / 0% 100%;
  transition: background-size 0.35s ease;
  padding: 0 2px;
}
.post-row:hover .title,
.post-row:focus-visible .title {
  background-size: 100% 100%;
}
</style>

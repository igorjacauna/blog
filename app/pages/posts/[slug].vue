<script setup lang="ts">
const route = useRoute()
const path = computed(() => `/posts/${route.params.slug}`)

const { data: post } = await useAsyncData(`post-${route.params.slug}`, () => queryCollection('posts').path(path.value).first())

if (!post.value || (post.value.draft && !import.meta.dev))
  throw createError({ statusCode: 404, statusMessage: 'Post não encontrado', fatal: true })

const { data: surround } = await useAsyncData(`surround-${route.params.slug}`, () =>
  queryCollectionItemSurroundings('posts', path.value, { fields: ['title', 'path'] })
    .where('draft', '=', false)
    .order('date', 'DESC'))

const siteUrl = 'https://igorjacauna.com.br'
const url = `${siteUrl}${path.value}`
const sourcePath = `content/posts/${route.params.slug}.md`
const editUrl = `https://github.com/igorjacauna/blog/edit/v2/${sourcePath}`
const rawUrl = `https://github.com/igorjacauna/blog/blob/v2/${sourcePath}?plain=1`
const shareText = encodeURIComponent(`${post.value.title} ${url}`)

const toc = computed(() => post.value?.body?.toc?.links ?? [])

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogType: 'article',
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  articlePublishedTime: new Date(post.value.date).toISOString(),
  articleModifiedTime: post.value.updated ? new Date(post.value.updated).toISOString() : undefined,
  articleTag: post.value.tags,
  twitterCard: 'summary_large_image',
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.value.title,
      'description': post.value.description,
      'datePublished': new Date(post.value.date).toISOString(),
      'dateModified': new Date(post.value.updated ?? post.value.date).toISOString(),
      'inLanguage': 'pt-BR',
      'url': url,
      'author': { '@type': 'Person', 'name': 'Igor Jacaúna', 'url': siteUrl },
    }),
  }],
})

defineOgImage('Post', {
  title: post.value.title,
  description: post.value.description,
  date: formatDate(post.value.date),
  readingTime: post.value.readingTime,
})
</script>

<template>
  <article v-if="post" class="container-text relative">
    <header class="mb-10">
      <h1 class="font-serif text-[2.6rem] sm:text-[3.4rem] leading-[1.05] mb-4">
        {{ post.title }}
      </h1>
      <p class="font-hand text-[1.45rem] text-[var(--fg-faint)] flex flex-wrap gap-x-2">
        <time :datetime="new Date(post.date).toISOString()">{{ formatDate(post.date) }}</time>
        <span v-if="post.readingTime">· {{ post.readingTime }} min de leitura</span>
        <span v-if="post.draft" class="text-amber-600">· rascunho</span>
      </p>
      <p v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </p>
    </header>

    <aside v-if="toc.length > 1" class="toc hidden xl:block">
      <p class="hand-note text-[1.4rem] mb-3 -rotate-2 origin-left">
        neste post ↓
      </p>
      <ul class="space-y-1.5">
        <li v-for="link in toc" :key="link.id">
          <a :href="`#${link.id}`" class="link-muted text-sm leading-snug block">{{ link.text }}</a>
          <ul v-if="link.children?.length" class="pl-3 mt-1.5 space-y-1.5">
            <li v-for="child in link.children" :key="child.id">
              <a :href="`#${child.id}`" class="link-muted text-[0.8rem] leading-snug block opacity-80">{{ child.text }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="prose">
      <ContentRenderer :value="post" />
    </div>

    <footer class="mt-14 pt-6 border-t border-[var(--border)] text-sm">
      <div class="flex flex-wrap gap-x-5 gap-y-2 text-[var(--fg-muted)]">
        <span>Compartilhar:</span>
        <a :href="`https://bsky.app/intent/compose?text=${shareText}`" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1"><span class="i-simple-icons-bluesky" /> Bluesky</a>
        <a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1"><span class="i-simple-icons-linkedin" /> LinkedIn</a>
        <span class="flex-1" />
        <a :href="editUrl" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1"><span class="i-ph-pencil-simple" /> Sugerir correção</a>
        <a :href="rawUrl" target="_blank" rel="noopener" class="link-muted inline-flex items-center gap-1"><span class="i-ph-file-md" /> Markdown</a>
      </div>

      <nav v-if="surround" class="mt-10 grid sm:grid-cols-2 gap-4">
        <NuxtLink v-if="surround[1]" :to="surround[1].path" class="surround">
          <span class="font-hand text-[1.25rem] text-[var(--fg-faint)]">← mais antigo</span>
          <span>{{ surround[1].title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="surround[0]" :to="surround[0].path" class="surround sm:text-right">
          <span class="font-hand text-[1.25rem] text-[var(--fg-faint)]">mais recente →</span>
          <span>{{ surround[0].title }}</span>
        </NuxtLink>
      </nav>
    </footer>
  </article>
</template>

<style scoped>
.toc {
  position: absolute;
  left: calc(100% + 1rem);
  top: 0;
  height: 100%;
  width: 14rem;
}
.toc > p, .toc > ul {
  position: sticky;
  top: 2rem;
}
.toc > ul {
  top: 4rem;
}
.tag {
  font-size: 0.8rem;
  padding: 0.1rem 0.55rem;
  border: 1px dashed var(--border-strong);
  border-radius: 999px;
  color: var(--fg-muted);
}
.surround {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.9rem 1.1rem;
  background: var(--card);
  border: 1.5px solid var(--card-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--shadow);
  color: var(--fg);
  transition: transform 0.2s, box-shadow 0.2s;
}
.surround:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--accent);
}
</style>

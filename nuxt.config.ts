const siteUrl = 'https://igorjacauna.com.br'

// Endereços do site antigo (tema Alpine) que já circularam por aí.
const oldPosts: Record<string, string> = {
  'vue/composables': 'composables',
  'vue/3d-hover': 'hover-3d',
  'vue/criando-chat-25-minutos': 'criando-chat-25-minutos',
  'vue/diferentes-rotas-nuxt': 'diferentes-rotas-nuxt',
  'vue/full-stack-firestore-nuxt': 'full-stack-firestore-nuxt',
  'vue/layers-layers-layers': 'layers-layers-layers',
  'vue/listas-virtuais': 'listas-virtuais',
  'geral/sustain-arduino': 'sustain-arduino',
  'react/reactmos': 'reactmos',
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-studio',
    '@unocss/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Igor Jacaúna', href: '/feed.xml' },
      ],
      meta: [
        { name: 'author', content: 'Igor Jacaúna' },
      ],
    },
  },

  css: ['~/assets/main.css'],

  site: {
    url: siteUrl,
    name: 'Igor Jacaúna',
    description: 'Dev frontend em Manaus. Escrevo sobre Vue, Nuxt, React, ferramentas open source e o que mais eu estiver construindo.',
    defaultLocale: 'pt-BR',
  },

  colorMode: {
    classSuffix: '',
    fallback: 'light',
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    build: {
      markdown: {
        toc: { depth: 3 },
        highlight: {
          theme: { default: 'vitesse-light', dark: 'vitesse-dark' },
          langs: ['vue', 'ts', 'js', 'tsx', 'jsx', 'json', 'bash', 'shell', 'html', 'css', 'cpp', 'yaml', 'diff'],
        },
      },
    },
  },

  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'igorjacauna',
      repo: 'blog',
      branch: 'v2',
      private: false,
    },
    git: {
      commit: { messagePrefix: 'post:' },
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Instrument Serif', provider: 'google', weights: [400], styles: ['normal', 'italic'] },
      { name: 'Caveat', provider: 'google', weights: [500, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] },
    ],
  },

  ogImage: {
    zeroRuntime: true,
  },

  sitemap: {
    exclude: ['/_studio/**'],
  },

  robots: {
    disallow: ['/_studio'],
  },

  routeRules: {
    '/blog': { redirect: { to: '/posts', statusCode: 301 } },
    '/blog/**': { redirect: { to: '/posts', statusCode: 301 } },
    ...Object.fromEntries(Object.entries(oldPosts).map(([from, to]) => [
      `/blog/${from}`,
      { redirect: { to: `/posts/${to}`, statusCode: 301 } },
    ])),
  },

  hooks: {
    // Tempo de leitura (~200 palavras por minuto) calculado no build.
    'content:file:afterParse'(ctx) {
      if (ctx.collection.name !== 'posts' || typeof ctx.file.body !== 'string')
        return
      const text = ctx.file.body.replace(/^---[\s\S]*?---/, '')
      const words = text.split(/\s+/).filter(Boolean).length
      ctx.content.readingTime = Math.max(1, Math.round(words / 200))
    },
  },

  compatibilityDate: '2025-11-01',

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'igorjacauna',
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'igorjacauna-content',
            database_id: '9ebcd39e-0aba-4e42-827f-1958afeae18e',
          },
        ],
        observability: { enabled: true },
        workers_dev: true,
        // Passa pelo Worker antes dos arquivos estáticos para o redirect de www/http funcionar.
        assets: { run_worker_first: true },
        routes: [
          { pattern: 'igorjacauna.com.br', custom_domain: true },
          { pattern: 'www.igorjacauna.com.br', custom_domain: true },
        ],
      },
    },
    prerender: {
      routes: ['/', '/posts', '/projetos', '/sobre', '/cv', '/feed.xml'],
      crawlLinks: true,
      autoSubfolderIndex: false,
      ignore: ['/blog', '/_studio'],
    },
  },
})

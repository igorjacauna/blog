import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        date: z.date(),
        updated: z.date().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
        readingTime: z.number().optional(),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        // Nota escrita "à mão" (fonte Caveat) logo abaixo do texto.
        note: z.string().optional(),
        // Desenho seu (ex.: /rabiscos/eu.png) e a legenda dele.
        doodle: z.string().optional(),
        doodleCaption: z.string().optional(),
      }),
    }),
    projects: defineCollection({
      type: 'data',
      source: 'projects.yml',
      schema: z.object({
        groups: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            name: z.string(),
            description: z.string(),
            url: z.string(),
            icon: z.string().optional(),
            npm: z.string().optional(),
          })),
        })),
        contributions: z.array(z.object({
          repo: z.string(),
          title: z.string(),
          url: z.string(),
          date: z.string(),
        })),
      }),
    }),
  },
})

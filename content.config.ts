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

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: {
        include: 'posts/*.md',
        prefix: '/',
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        slug: z.string(),
        cover: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        hashnodeId: z.string().optional(),
      }),
    }),
    drafts: defineCollection({
      type: 'page',
      source: 'drafts/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        slug: z.string(),
        cover: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(true),
        hashnodeId: z.string().optional(),
      }),
    }),
  },
})

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
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
        status: z.enum(['live', 'experiment', 'archived']).default('experiment'),
        source: z.enum(['open-source', 'private']).default('open-source'),
        repoUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        writeupUrl: z.string().optional(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(999),
      }),
    }),
  },
})

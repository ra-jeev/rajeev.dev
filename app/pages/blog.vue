<script setup lang="ts">
const route = useRoute()

const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all())

const allPosts = computed(() => posts.value || [])

const activeTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' && tag.length ? tag : undefined
})

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of allPosts.value) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
})

const visiblePosts = computed(() => (activeTag.value
  ? allPosts.value.filter(post => post.tags?.includes(activeTag.value!))
  : allPosts.value))

useSeoMeta({
  title: 'Writing',
  description: 'Build notes, tutorials, and practical project write-ups by Rajeev R Sharma.',
})
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Writing</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">Practical notes from building things.</h1>
      <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Mostly hands-on posts about Nuxt, Cloudflare, AI, developer tooling, and the decisions that show up while turning ideas into working software.
      </p>
    </header>

    <div v-if="tags.length" class="mt-8 flex flex-wrap items-center gap-2">
      <NuxtLink
        to="/blog"
        class="rounded-full border px-3 py-1 text-xs font-medium no-underline transition"
        :class="activeTag
          ? 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
          : 'border-fuchsia-700 text-fuchsia-700 dark:border-fuchsia-300 dark:text-fuchsia-300'"
      >
        All
      </NuxtLink>
      <NuxtLink
        v-for="tag in tags"
        :key="tag"
        :to="{ path: '/blog', query: { tag } }"
        class="rounded-full border px-3 py-1 text-xs font-medium no-underline transition"
        :class="activeTag === tag
          ? 'border-fuchsia-700 text-fuchsia-700 dark:border-fuchsia-300 dark:text-fuchsia-300'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'"
      >
        {{ tag }}
      </NuxtLink>
    </div>

    <p v-if="activeTag" class="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
      {{ visiblePosts.length }} {{ visiblePosts.length === 1 ? 'post' : 'posts' }} tagged
      <span class="font-semibold text-zinc-950 dark:text-zinc-100">{{ activeTag }}</span>.
      <NuxtLink to="/blog" class="font-medium text-fuchsia-700 dark:text-fuchsia-300">Clear filter</NuxtLink>
    </p>

    <div class="mt-8">
      <PostCard v-for="post in visiblePosts" :key="post.path" :post="post" />
    </div>

    <p v-if="!visiblePosts.length" class="mt-8 text-zinc-600 dark:text-zinc-400">
      No posts carry that tag yet.
    </p>
  </section>
</template>

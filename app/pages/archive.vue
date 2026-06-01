<script setup lang="ts">
const { data: posts } = await useAsyncData('archive-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all())

const groups = computed(() => {
  const map = new Map<string, typeof posts.value>()
  for (const post of posts.value || []) {
    const year = new Date(post.date).getFullYear().toString()
    const entries = map.get(year) || []
    entries.push(post)
    map.set(year, entries)
  }
  return Array.from(map.entries())
})

const formatDate = (date: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
}).format(new Date(date))

useSeoMeta({
  title: 'Archive',
  description: 'A chronological archive of Rajeev\'s writing.',
})
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6">
    <header>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Archive</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">All writing, by date.</h1>
    </header>

    <div class="mt-10 space-y-10">
      <section v-for="[year, yearPosts] in groups" :key="year" class="grid gap-4 border-t border-zinc-200 pt-6 md:grid-cols-[8rem_1fr] dark:border-zinc-800">
        <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">{{ year }}</h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="post in yearPosts"
            :key="post.path"
            :to="post.path"
            class="block rounded-md border border-zinc-200 p-4 no-underline transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
          >
            <div class="grid gap-2 sm:grid-cols-[5rem_1fr]">
              <time :datetime="post.date" class="text-sm text-zinc-500 dark:text-zinc-500">{{ formatDate(post.date) }}</time>
              <span class="font-medium text-zinc-950 dark:text-zinc-100">{{ post.title }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>

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
  <section class="page-shell py-12">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Archive</p>
      <h1 class="mt-3 text-4xl font-semibold text-slate-950">Everything, by date.</h1>
    </div>

    <div class="mt-10 space-y-10">
      <section v-for="[year, yearPosts] in groups" :key="year" class="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-[8rem_1fr]">
        <h2 class="text-2xl font-semibold text-slate-950">{{ year }}</h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="post in yearPosts"
            :key="post.path"
            :to="post.path"
            class="grid gap-2 rounded-md border border-slate-200 bg-white p-4 no-underline transition hover:border-teal-300 hover:shadow-sm sm:grid-cols-[5rem_1fr]"
          >
            <time :datetime="post.date" class="text-sm text-slate-500">{{ formatDate(post.date) }}</time>
            <span class="font-medium text-slate-950">{{ post.title }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>

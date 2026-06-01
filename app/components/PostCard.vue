<script setup lang="ts">
defineProps<{
  post: {
    path: string
    title: string
    description?: string
    date: string
    cover?: string
    tags?: string[]
  }
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(date))
</script>

<template>
  <article class="border-b border-zinc-200 py-7 first:pt-0 dark:border-zinc-800">
    <NuxtLink :to="post.path" class="group grid gap-5 no-underline sm:grid-cols-[18rem_1fr]">
      <CoverImage
        v-if="post.cover"
        :src="post.cover"
        :alt="post.title"
        class="aspect-40/21 w-full rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
        loading="lazy"
      />
      <div v-else class="aspect-40/21 w-full rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950" />

      <div class="min-w-0">
        <time :datetime="post.date" class="text-sm text-zinc-500 dark:text-zinc-500">{{ formatDate(post.date) }}</time>
        <h2 class="mt-2 text-xl font-semibold leading-snug text-zinc-950 group-hover:text-fuchsia-700 dark:text-zinc-100 dark:group-hover:text-fuchsia-300">
          {{ post.title }}
        </h2>
        <p v-if="post.description" class="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
          {{ post.description }}
        </p>
        <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

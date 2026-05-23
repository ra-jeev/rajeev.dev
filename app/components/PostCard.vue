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
  <article class="group grid gap-4 border-b border-slate-200 py-7 sm:grid-cols-[10rem_1fr]">
    <NuxtLink :to="post.path" class="overflow-hidden rounded-md bg-slate-200 no-underline sm:aspect-[4/3]">
      <img
        v-if="post.cover"
        :src="post.cover"
        :alt="post.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      >
      <div v-else class="grid h-full min-h-28 place-items-center bg-teal-50 text-teal-800">
        <UIcon name="i-lucide-file-text" class="size-7" />
      </div>
    </NuxtLink>

    <div class="min-w-0">
      <div class="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span v-for="tag in post.tags?.slice(0, 3)" :key="tag" class="rounded bg-slate-100 px-2 py-1 text-slate-600">
          {{ tag }}
        </span>
      </div>
      <h2 class="text-balance text-xl font-semibold text-slate-950">
        <NuxtLink :to="post.path" class="no-underline hover:text-teal-700">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <p v-if="post.description" class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {{ post.description }}
      </p>
    </div>
  </article>
</template>

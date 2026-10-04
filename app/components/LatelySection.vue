<script setup lang="ts">
// Loaded in the browser: the home page is prerendered, and this log changes every day.
const { data } = useFetch('/api/lately', {
  server: false,
  lazy: true,
})

const posts = computed(() => data.value?.posts || [])

const formatDay = (day: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${day}T00:00:00Z`))
</script>

<template>
  <section v-if="posts.length" class="border-t border-zinc-200 py-10 dark:border-zinc-800">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Lately</p>
        <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">What I got done</h2>
      </div>
      <a
        :href="data!.profile"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-fuchsia-700 sm:inline-flex dark:text-zinc-400 dark:hover:text-fuchsia-300"
      >
        Full log
        <Icon name="lucide:arrow-up-right" class="size-4" />
      </a>
    </div>

    <ol class="divide-y divide-zinc-200 dark:divide-zinc-800">
      <li
        v-for="post in posts"
        :key="post.id"
        class="grid gap-1 py-4 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:gap-4"
      >
        <a
          :href="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium tabular-nums text-zinc-500 no-underline hover:text-fuchsia-700 sm:pt-0.5 dark:text-zinc-500 dark:hover:text-fuchsia-300"
        >
          <time :datetime="post.day">{{ formatDay(post.day) }}</time>
        </a>
        <div class="min-w-0">
          <p class="whitespace-pre-line leading-7 text-zinc-700 dark:text-zinc-300">{{ post.text }}</p>
          <div v-if="post.products.length" class="mt-2 flex flex-wrap gap-2">
            <a
              v-for="product in post.products"
              :key="product.url"
              :href="product.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 no-underline transition hover:border-zinc-300 hover:text-fuchsia-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-fuchsia-300"
            >
              {{ product.name }}
            </a>
          </div>
        </div>
      </li>
    </ol>

    <a
      :href="data!.profile"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-fuchsia-700 sm:hidden dark:text-zinc-400 dark:hover:text-fuchsia-300"
    >
      Full log
      <Icon name="lucide:arrow-up-right" class="size-4" />
    </a>
  </section>
</template>

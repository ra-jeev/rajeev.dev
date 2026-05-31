<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .limit(4)
  .all())

const latest = computed(() => posts.value?.[0])
const recentPosts = computed(() => posts.value || [])

useSeoMeta({
  title: 'Home',
  description: 'Rajeev builds and writes about Nuxt, Cloudflare, AI, and useful software experiments.',
  ogTitle: 'Rajeev',
  ogDescription: 'Writing, projects, experiments, and notes from Rajeev.',
})
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-5 sm:px-6">
    <section class="grid gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-end">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Rajeev</p>
        <h1 class="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl dark:text-zinc-100">
          Notes from building small, useful things on the web.
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I write about Nuxt, Cloudflare, AI, developer tools, and the experiments that turn into products, posts, or useful lessons.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
          >
            Read writing
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
          <NuxtLink
            to="/archive"
            class="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
          >
            Browse archive
          </NuxtLink>
        </div>
      </div>

      <aside v-if="latest" class="border-l border-zinc-200 pl-6 dark:border-zinc-800">
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-500">Latest</p>
        <NuxtLink :to="latest.path" class="group mt-3 block no-underline">
          <CoverImage
            v-if="latest.cover"
            :src="latest.cover"
            :alt="latest.title"
            class="aspect-40/21 w-full rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            loading="eager"
          />
          <h2 class="mt-4 text-xl font-semibold leading-snug text-zinc-950 group-hover:text-teal-700 dark:text-zinc-100 dark:group-hover:text-teal-300">
            {{ latest.title }}
          </h2>
          <p v-if="latest.description" class="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
            {{ latest.description }}
          </p>
        </NuxtLink>
      </aside>
    </section>

    <section class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div class="grid gap-6 sm:grid-cols-3">
        <NuxtLink to="/blog" class="group no-underline">
          <Icon name="lucide:notebook-tabs" class="size-5 text-teal-700 dark:text-teal-300" />
          <h2 class="mt-3 font-semibold text-zinc-950 group-hover:text-teal-700 dark:text-zinc-100 dark:group-hover:text-teal-300">Writing</h2>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Build notes, tutorials, and reflections from finished experiments.</p>
        </NuxtLink>
        <NuxtLink to="/about" class="group no-underline">
          <Icon name="lucide:hammer" class="size-5 text-teal-700 dark:text-teal-300" />
          <h2 class="mt-3 font-semibold text-zinc-950 group-hover:text-teal-700 dark:text-zinc-100 dark:group-hover:text-teal-300">Projects</h2>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Apps, demos, and tools that begin as curiosity and become useful.</p>
        </NuxtLink>
        <NuxtLink to="/archive" class="group no-underline">
          <Icon name="lucide:flask-conical" class="size-5 text-teal-700 dark:text-teal-300" />
          <h2 class="mt-3 font-semibold text-zinc-950 group-hover:text-teal-700 dark:text-zinc-100 dark:group-hover:text-teal-300">Archive</h2>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">A chronological trail of posts from Hashnode and this site.</p>
        </NuxtLink>
      </div>
    </section>

    <section class="py-12">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Recent</p>
          <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Latest writing</h2>
        </div>
        <NuxtLink to="/blog" class="hidden items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-teal-700 sm:inline-flex dark:text-zinc-400 dark:hover:text-teal-300">
          All posts
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <PostCard v-for="post in recentPosts" :key="post.path" :post="post" />
    </section>
  </div>
</template>

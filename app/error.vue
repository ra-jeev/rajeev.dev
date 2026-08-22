<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

const heading = computed(() => (isNotFound.value
  ? 'This page is not here.'
  : 'Something went wrong.'))

const blurb = computed(() => (isNotFound.value
  ? 'The link may be old, or the page may have moved. The writing and the projects are both one click away.'
  : 'An unexpected error came up while loading this page. Trying again often works.'))

useSeoMeta({
  title: () => (isNotFound.value ? 'Page not found' : 'Error'),
  description: 'The page you asked for could not be found on rajeev.dev.',
  robots: 'noindex',
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <section class="mx-auto flex w-full max-w-4xl flex-col items-start px-5 py-24 sm:px-6">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">
        Error {{ error?.statusCode || 500 }}
      </p>
      <h1 class="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl dark:text-zinc-100">
        {{ heading }}
      </h1>
      <p class="mt-5 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {{ blurb }}
      </p>

      <div class="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 rounded-md bg-zinc-950 px-4 py-2.5 text-white no-underline transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
          @click="clearError({ redirect: '/' })"
        >
          <Icon name="lucide:home" class="size-4" />
          Home
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-4 py-2.5 text-zinc-700 no-underline transition hover:border-zinc-300 hover:text-fuchsia-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-fuchsia-300"
          @click="clearError({ redirect: '/blog' })"
        >
          <Icon name="lucide:file-text" class="size-4" />
          Writing
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-4 py-2.5 text-zinc-700 no-underline transition hover:border-zinc-300 hover:text-fuchsia-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-fuchsia-300"
          @click="clearError({ redirect: '/projects' })"
        >
          <Icon name="lucide:layout-grid" class="size-4" />
          Projects
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

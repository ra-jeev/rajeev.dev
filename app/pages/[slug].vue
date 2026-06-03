<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://rajeev.dev'
const path = computed(() => `/${route.params.slug}`)
const localUrl = computed(() => `${siteUrl}${path.value}`)

const { data: post } = await useAsyncData(`post-${route.params.slug}`, () => queryCollection('posts')
  .path(path.value)
  .first())

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const publishedDate = computed(() => new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(post.value!.date)))
const coverUrl = computed(() => {
  if (!post.value?.cover) {
    return undefined
  }

  return post.value.cover.startsWith('http')
    ? post.value.cover
    : `${siteUrl}${post.value.cover}`
})
const canonicalUrl = computed(() => post.value?.canonicalUrl || localUrl.value)

useSeoMeta({
  title: () => post.value?.title || 'Article',
  description: () => post.value?.description || undefined,
  ogTitle: () => post.value?.title || undefined,
  ogDescription: () => post.value?.description || undefined,
  ogImage: () => coverUrl.value,
  ogType: 'article',
  ogUrl: () => canonicalUrl.value,
  articlePublishedTime: () => post.value?.date || undefined,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title || undefined,
  twitterDescription: () => post.value?.description || undefined,
  twitterImage: () => coverUrl.value,
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
})
</script>

<template>
  <article v-if="post" class="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6">
    <header>
      <NuxtLink to="/blog" class="text-sm font-medium text-fuchsia-700 no-underline hover:text-fuchsia-800 dark:text-fuchsia-300 dark:hover:text-fuchsia-200">
        Writing
      </NuxtLink>
      <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl dark:text-zinc-100">
        {{ post.title }}
      </h1>
      <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500">
        <time :datetime="post.date">{{ publishedDate }}</time>
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
        >
          {{ tag }}
        </span>
      </div>
    </header>

    <CoverImage
      v-if="post.cover"
      :src="post.cover"
      :alt="post.title"
      class="mt-8 aspect-40/21 max-h-130 w-full rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
      loading="eager"
    />

    <div class="prose-scope mx-auto mt-10 max-w-3xl">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>

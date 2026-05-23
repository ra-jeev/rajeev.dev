<script setup lang="ts">
const route = useRoute()
const path = computed(() => `/${route.params.slug}`)

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

useSeoMeta({
  title: () => post.value?.title || 'Article',
  description: () => post.value?.description || undefined,
  ogTitle: () => post.value?.title || undefined,
  ogDescription: () => post.value?.description || undefined,
  ogImage: () => post.value?.cover || undefined,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: `https://rajeev.dev${path.value}` },
  ],
})
</script>

<template>
  <article class="page-shell py-10">
    <header class="mx-auto max-w-3xl">
      <NuxtLink to="/blog" class="text-sm font-medium text-teal-700 no-underline hover:text-teal-900">
        Writing
      </NuxtLink>
      <h1 class="mt-4 text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
        {{ post.title }}
      </h1>
      <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <time :datetime="post.date">{{ publishedDate }}</time>
        <span v-for="tag in post.tags" :key="tag" class="rounded bg-slate-100 px-2 py-1 text-slate-600">
          {{ tag }}
        </span>
      </div>
    </header>

    <img
      v-if="post.cover"
      :src="post.cover"
      :alt="post.title"
      class="mx-auto mt-8 aspect-[16/8] max-h-[520px] w-full max-w-5xl rounded-md border border-slate-200 bg-white object-cover"
    >

    <div class="prose-scope prose prose-slate mx-auto mt-10 max-w-3xl">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all())

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

    <div class="mt-8">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </section>
</template>

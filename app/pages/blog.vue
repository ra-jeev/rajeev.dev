<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all())

useSeoMeta({
  title: 'Writing',
  description: 'Articles and build notes by Rajeev.',
})
</script>

<template>
  <section class="page-shell py-12">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Writing</p>
      <h1 class="mt-3 text-balance text-4xl font-semibold text-slate-950">Articles, build notes, and experiments.</h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        The old Hashnode article URLs still live at the root, while this page collects the writing in one place.
      </p>
    </div>

    <div class="mt-8">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </section>
</template>

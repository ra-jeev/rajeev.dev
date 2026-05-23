<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .limit(3)
  .all())

const latest = computed(() => posts.value?.[0])

useSeoMeta({
  title: 'Home',
  description: 'Rajeev builds and writes about Nuxt, Cloudflare, AI, and useful software experiments.',
  ogTitle: 'Rajeev',
  ogDescription: 'Writing, projects, experiments, and notes from Rajeev.',
})
</script>

<template>
  <div>
    <section class="page-shell grid gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
      <div>
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Rajeev</p>
        <h1 class="text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Building useful software in public, one careful experiment at a time.
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          This is the home base for my writing, projects, and notes around Nuxt, Cloudflare, AI, developer tools, and small product ideas.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <UButton to="/blog" color="primary" icon="i-lucide-pen-line">Read writing</UButton>
          <UButton to="/archive" variant="soft" color="neutral" icon="i-lucide-archive">Browse archive</UButton>
        </div>
      </div>

      <NuxtLink
        v-if="latest"
        :to="latest.path"
        class="group block overflow-hidden rounded-md border border-slate-200 bg-white no-underline shadow-sm"
      >
        <img
          v-if="latest.cover"
          :src="latest.cover"
          :alt="latest.title"
          class="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        >
        <div class="p-5">
          <p class="text-sm font-medium text-teal-700">Latest writing</p>
          <h2 class="mt-2 text-balance text-2xl font-semibold text-slate-950 group-hover:text-teal-700">
            {{ latest.title }}
          </h2>
        </div>
      </NuxtLink>
    </section>

    <section class="border-y border-slate-200 bg-white/70">
      <div class="page-shell grid gap-4 py-8 sm:grid-cols-3">
        <div class="rounded-md border border-slate-200 bg-white p-5">
          <UIcon name="i-lucide-notebook-tabs" class="mb-4 size-6 text-teal-700" />
          <h2 class="font-semibold text-slate-950">Writing</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">Long-form build notes, tutorials, and reflections from finished experiments.</p>
        </div>
        <div class="rounded-md border border-slate-200 bg-white p-5">
          <UIcon name="i-lucide-hammer" class="mb-4 size-6 text-amber-700" />
          <h2 class="font-semibold text-slate-950">Projects</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">Apps, demos, and tools that usually begin as curiosity and become working software.</p>
        </div>
        <div class="rounded-md border border-slate-200 bg-white p-5">
          <UIcon name="i-lucide-flask-conical" class="mb-4 size-6 text-sky-700" />
          <h2 class="font-semibold text-slate-950">Experiments</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">Smaller technical notes, trials, and ideas that may grow into something larger.</p>
        </div>
      </div>
    </section>

    <section class="page-shell py-12">
      <div class="mb-4 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Recent</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-950">Latest writing</h2>
        </div>
        <UButton to="/blog" variant="ghost" color="neutral" trailing-icon="i-lucide-arrow-right">All posts</UButton>
      </div>
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </section>
  </div>
</template>

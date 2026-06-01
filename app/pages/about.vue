<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'About Rajeev and rajeev.dev.',
})
</script>

<template>
  <section class="mx-auto grid w-full max-w-4xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[0.8fr_1.2fr]">
    <header>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">About</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">A personal space for writing, building, and trying things.</h1>
    </header>
    <div class="space-y-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
      <p>
        I am Rajeev. I build mostly with Nuxt, Cloudflare, AI tools, and whatever else helps an idea become useful quickly.
      </p>
      <p>
        The blog used to live fully on Hashnode. This version keeps the article links intact, but lets the domain grow into a broader home for projects, experiments, and notes.
      </p>
    </div>
  </section>
</template>

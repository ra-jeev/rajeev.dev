<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'About Rajeev and rajeev.dev.',
})
</script>

<template>
  <section class="page-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">About</p>
      <h1 class="mt-3 text-balance text-4xl font-semibold text-slate-950">A personal space for writing, building, and trying things.</h1>
    </div>
    <div class="space-y-6 text-lg leading-8 text-slate-600">
      <p>
        I am Rajeev. I build mostly with Nuxt, Cloudflare, AI tools, and whatever else helps an idea become useful quickly.
      </p>
      <p>
        The blog used to live fully on Hashnode. This version keeps the article links intact, but lets the domain grow into a broader home for projects, experiments, and notes.
      </p>
    </div>
  </section>
</template>

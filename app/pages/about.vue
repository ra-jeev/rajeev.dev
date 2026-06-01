<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'About Rajeev, his writing, and the projects on rajeev.dev.',
})
</script>

<template>
  <section class="mx-auto grid w-full max-w-4xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[0.8fr_1.2fr]">
    <header>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">About</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">A place for the things I build and the notes that fall out of them.</h1>
    </header>
    <div class="space-y-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
      <p>
        I am Rajeev. I like building small, useful software: AI-assisted tools, devotional reading apps, browser games, and web experiments that start with a practical itch.
      </p>
      <p>
        This site keeps the old Hashnode article links intact, but it is now broader than a blog. It is a living index of writing, shipped apps, public projects, and experiments that are still worth keeping around.
      </p>
    </div>
  </section>
</template>

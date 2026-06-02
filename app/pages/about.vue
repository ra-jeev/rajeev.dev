<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'About Rajeev R Sharma, his writing, and the projects on rajeev.dev.',
})
</script>

<template>
  <main class="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6">
    <section class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">About</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">Hello 👋</h1>

      <div class="mt-6 space-y-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        <p>
          I am Rajeev R Sharma, a developer focused on building clear, useful web applications. I enjoy taking a small idea seriously, making it work end to end, and then writing down the decisions that shaped it.
        </p>
        <p>
          Lately that has meant a lot of Nuxt, Cloudflare, AI tools, and practical full-stack experiments. Some things here are live products; others are small builds that still explain how I think.
        </p>
        <p>
          This domain used to be mostly a Hashnode-powered blog. The old article links still work, but the site now has room for projects too: shipped apps, open-source experiments, and the odd idea that escaped the scratchpad.
        </p>
      </div>
    </section>

    <section class="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Contact</h2>
      <p class="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
        If you want to discuss a project, ask about something I wrote, or just say hello, email is the best place to start.
      </p>
      <SiteSocialLinks class="mt-5" show-labels />
    </section>
  </main>
</template>

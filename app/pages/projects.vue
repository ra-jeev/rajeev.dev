<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects')
  .order('order', 'ASC')
  .all())

const shippedProjects = computed(() => (projects.value || []).filter(project => project.category === 'shipped'))
const experiments = computed(() => (projects.value || []).filter(project => project.category === 'experiment'))

useSeoMeta({
  title: 'Projects',
  description: 'Projects, shipped apps, and experiments by Rajeev R Sharma.',
})
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Projects</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">
        Software I have shipped, shared, or learned from.
      </h1>
      <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        A working index of apps, tools, demos, and writing-adjacent builds. Some link to code, some link to the live app, and some are best understood through the write-up behind them.
      </p>
    </header>

    <section v-if="shippedProjects.length" class="mt-12">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Shipped apps</h2>
      <p class="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        Things that are live as products, utilities, or long-running public sites.
      </p>
      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <ProjectCard v-for="project in shippedProjects" :key="project.id || project.title" :project="project" />
      </div>
    </section>

    <section v-if="experiments.length" class="mt-12">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Experiments</h2>
      <p class="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        Public demos, smaller builds, and learning projects. The ones I would point to first are kept near the top.
      </p>
      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <ProjectCard v-for="project in experiments" :key="project.id || project.title" :project="project" />
      </div>
    </section>
  </section>
</template>

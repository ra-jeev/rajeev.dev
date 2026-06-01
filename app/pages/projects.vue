<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects')
  .order('order', 'ASC')
  .all())

const liveProjects = computed(() => (projects.value || []).filter(project => project.status === 'live'))
const experiments = computed(() => (projects.value || []).filter(project => project.status !== 'live'))
const privateProjects = computed(() => liveProjects.value.filter(project => project.source === 'private'))
const openProjects = computed(() => liveProjects.value.filter(project => project.source !== 'private'))

useSeoMeta({
  title: 'Projects',
  description: 'Open source experiments, live apps, and personal projects by Rajeev.',
})
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Projects</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-100">
        Things I have built, shipped, or written about.
      </h1>
      <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        A working index of open source projects, public demos, and private production apps. Some have source code, some have write-ups, and some are simply live things I maintain.
      </p>
    </header>

    <section v-if="openProjects.length" class="mt-12">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Open source and live demos</h2>
      <div class="mt-5 grid gap-5">
        <ProjectCard v-for="project in openProjects" :key="project.id || project.title" :project="project" />
      </div>
    </section>

    <section v-if="privateProjects.length" class="mt-12">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Private production projects</h2>
      <p class="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        These are public-facing or production projects where the source is private.
      </p>
      <div class="mt-5 grid gap-5">
        <ProjectCard v-for="project in privateProjects" :key="project.id || project.title" :project="project" />
      </div>
    </section>

    <section v-if="experiments.length" class="mt-12">
      <h2 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Older experiments</h2>
      <div class="mt-5 grid gap-5">
        <ProjectCard v-for="project in experiments" :key="project.id || project.title" :project="project" />
      </div>
    </section>
  </section>
</template>

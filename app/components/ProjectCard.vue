<script setup lang="ts">
defineProps<{
  project: {
    title: string
    description: string
    status?: 'live' | 'experiment' | 'archived'
    source?: 'open-source' | 'private'
    repoUrl?: string
    liveUrl?: string
    writeupUrl?: string
    tags?: string[]
  }
}>()
</script>

<template>
  <article class="rounded-lg border border-zinc-200 bg-white/55 p-5 dark:border-zinc-800 dark:bg-zinc-900/25">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <h3 class="text-xl font-semibold leading-snug text-zinc-950 dark:text-zinc-100">
        {{ project.title }}
      </h3>
      <span class="rounded-full border border-fuchsia-200 px-2.5 py-1 text-xs font-medium capitalize text-fuchsia-700 dark:border-fuchsia-900/70 dark:text-fuchsia-300">
        {{ project.status || 'experiment' }}
      </span>
    </div>

    <p class="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
      {{ project.description }}
    </p>

    <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
      >
        {{ tag }}
      </span>
    </div>

    <ProjectLinks :project="project" class="mt-5" />
  </article>
</template>

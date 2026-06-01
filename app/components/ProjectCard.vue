<script setup lang="ts">
defineProps<{
  project: {
    title: string
    description: string
    repoUrl?: string
    liveUrl?: string
    writeupUrl?: string
    tags?: string[]
  }
}>()
</script>

<template>
  <article class="rounded-lg border border-zinc-200 bg-white/55 p-5 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/25 dark:hover:border-zinc-700">
    <div class="flex items-start justify-between gap-3">
      <h3 class="flex min-w-0 items-center gap-2 text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-100">
        {{ project.title }}
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live project"
          :aria-label="`Open ${project.title}`"
          class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 no-underline transition hover:bg-zinc-100 hover:text-fuchsia-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-fuchsia-300"
        >
          <Icon name="lucide:external-link" class="size-4" />
        </a>
      </h3>
      <ProjectLinks :project="project" class="shrink-0" />
    </div>

    <p class="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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

  </article>
</template>

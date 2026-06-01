<script setup lang="ts">
defineProps<{
  project: {
    repoUrl?: string
    liveUrl?: string
    writeupUrl?: string
    source?: 'open-source' | 'private'
  }
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <a
      v-if="project.liveUrl"
      :href="project.liveUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-semibold text-white no-underline transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
    >
      <Icon name="lucide:external-link" class="size-3.5" />
      Live
    </a>
    <a
      v-if="project.repoUrl"
      :href="project.repoUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 no-underline transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
    >
      <Icon name="lucide:github" class="size-3.5" />
      Source
    </a>
    <NuxtLink
      v-if="project.writeupUrl"
      :to="project.writeupUrl"
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 no-underline transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
    >
      <Icon name="lucide:file-text" class="size-3.5" />
      Write-up
    </NuxtLink>
    <span
      v-if="project.source === 'private' && !project.repoUrl"
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-500"
    >
      <Icon name="lucide:lock" class="size-3.5" />
      Private source
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  project: {
    repoUrl?: string
    writeupUrl?: string
  }
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <a
      v-if="project.repoUrl"
      :href="project.repoUrl"
      target="_blank"
      rel="noopener noreferrer"
      title="Source"
      aria-label="Open repository"
      class="inline-flex size-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 no-underline transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
    >
      <Icon name="lucide:github" class="size-4" />
    </a>
    <NuxtLink
      v-if="project.writeupUrl"
      :to="project.writeupUrl"
      title="Write-up"
      aria-label="Read project write-up"
      class="inline-flex size-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 no-underline transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
    >
      <Icon name="lucide:file-text" class="size-4" />
    </NuxtLink>
  </div>
</template>

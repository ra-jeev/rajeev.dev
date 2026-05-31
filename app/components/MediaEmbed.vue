<script setup lang="ts">
const props = defineProps<{
  url: string
}>()

const youtubeId = computed(() => {
  try {
    const parsed = new URL(props.url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1)
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
  } catch {
    return null
  }
  return null
})
</script>

<template>
  <div class="my-8 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
    <iframe
      v-if="youtubeId"
      class="aspect-video w-full"
      :src="`https://www.youtube-nocookie.com/embed/${youtubeId}`"
      title="Embedded video"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
    <div v-else class="p-4">
      <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 no-underline transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
      >
        <Icon name="lucide:external-link" class="size-4" />
        Open embedded media
      </a>
    </div>
  </div>
</template>

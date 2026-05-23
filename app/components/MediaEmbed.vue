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
  <div class="my-8 overflow-hidden rounded-md border border-slate-200 bg-white">
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
      <UButton :to="url" target="_blank" rel="noopener noreferrer" variant="soft" color="neutral" icon="i-lucide-external-link">
        Open embedded media
      </UButton>
    </div>
  </div>
</template>

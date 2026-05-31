<script setup lang="ts">
defineProps<{
  src: string
  alt: string
  loading?: 'eager' | 'lazy'
}>()

const frameAspect = 40 / 21
const fit = ref<'cover' | 'contain'>('cover')

const updateFit = (event: Event) => {
  const image = event.target as HTMLImageElement
  const imageAspect = image.naturalWidth / image.naturalHeight
  fit.value = imageAspect > frameAspect ? 'contain' : 'cover'
}
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :loading="loading"
    :class="fit === 'cover' ? 'object-cover' : 'object-contain'"
    @load="updateFit"
  >
</template>

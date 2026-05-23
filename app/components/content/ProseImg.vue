<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
}>()
</script>

<template>
  <figure class="my-8">
    <img
      :src="src"
      :alt="alt || ''"
      class="mx-auto max-h-[680px] w-auto max-w-full rounded-md border border-slate-200 bg-white object-contain"
      loading="lazy"
    >
    <figcaption v-if="alt" class="mt-2 text-center text-sm text-slate-500">
      {{ alt }}
    </figcaption>
  </figure>
</template>

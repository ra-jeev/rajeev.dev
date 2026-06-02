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
      class="mx-auto max-h-170 w-auto max-w-full rounded-md border border-zinc-200 bg-white object-contain dark:border-zinc-800 dark:bg-zinc-950"
      loading="lazy"
    >
    <figcaption v-if="alt" class="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-500">
      {{ alt }}
    </figcaption>
  </figure>
</template>

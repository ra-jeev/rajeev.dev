<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://rajeev.dev'

useHead({
  link: [
    {
      key: 'canonical',
      rel: 'canonical',
      href: () => `${siteUrl}${route.path === '/' ? '/' : route.path}`,
    },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#d946ef" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

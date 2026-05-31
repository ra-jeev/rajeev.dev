<script setup lang="ts">
const navigation = [
  { label: 'Writing', to: '/blog' },
  { label: 'Archive', to: '/archive' },
  { label: 'About', to: '/about' },
]
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <header class="sticky top-0 z-40 border-b border-zinc-200/80 bg-stone-50/85 backdrop-blur dark:border-zinc-800/90 dark:bg-zinc-950/85">
      <div class="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-4 px-5 sm:px-6">
        <NuxtLink to="/" class="flex items-center gap-3 no-underline" aria-label="Rajeev home">
          <span class="inline-flex size-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white dark:bg-teal-500 dark:text-zinc-950">R</span>
          <span class="hidden text-sm font-semibold tracking-wide text-zinc-950 sm:inline dark:text-zinc-100">rajeev.dev</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <nav class="flex items-center gap-0.5 sm:gap-1" aria-label="Main navigation">
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              class="rounded-md px-2 py-2 text-xs font-medium text-zinc-600 transition hover:text-zinc-950 sm:px-3 sm:text-sm dark:text-zinc-400 dark:hover:text-zinc-100"
              active-class="text-zinc-950 dark:text-zinc-100"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <ColorModeToggle />
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-20 border-t border-zinc-200/80 dark:border-zinc-800/90">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 px-5 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <p>Rajeev writes and builds around Nuxt, Cloudflare, AI, and small useful software.</p>
        <div class="flex items-center gap-4">
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="hover:text-teal-700 dark:hover:text-teal-300">RSS</a>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" class="hover:text-teal-700 dark:hover:text-teal-300">Sitemap</a>
        </div>
      </div>
    </footer>
  </div>
</template>

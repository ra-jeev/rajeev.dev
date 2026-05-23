<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/88 backdrop-blur">
      <div class="page-shell flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="flex items-center gap-3 no-underline" aria-label="Rajeev home">
          <span class="grid size-9 place-items-center rounded-md bg-teal-700 text-sm font-semibold text-white">R</span>
          <span class="hidden text-sm font-semibold tracking-wide text-slate-900 sm:inline">rajeev.dev</span>
        </NuxtLink>

        <nav class="flex items-center gap-5 text-sm font-medium">
          <NuxtLink to="/blog" class="text-slate-700 no-underline hover:text-teal-700">Writing</NuxtLink>
          <NuxtLink to="/archive" class="text-slate-700 no-underline hover:text-teal-700">Archive</NuxtLink>
          <NuxtLink to="/about" class="text-slate-700 no-underline hover:text-teal-700">About</NuxtLink>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-20 border-t border-slate-200 bg-white/60">
      <div class="page-shell flex flex-col gap-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Rajeev writes and builds around Nuxt, Cloudflare, AI, and small useful software.</p>
        <div class="flex items-center gap-3">
          <NuxtLink to="/rss.xml" class="hover:text-teal-700">RSS</NuxtLink>
          <NuxtLink to="/sitemap.xml" class="hover:text-teal-700">Sitemap</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

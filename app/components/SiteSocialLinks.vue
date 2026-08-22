<script setup lang="ts">
withDefaults(defineProps<{
  showLabels?: boolean
}>(), {
  showLabels: false,
})

const links = [
  { label: 'GitHub', href: 'https://github.com/ra-jeev', icon: 'lucide:github' },
  { label: 'X', href: 'https://x.com/ra_jeeves', icon: 'x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajeevrsharma', icon: 'lucide:linkedin' },
  { label: 'Email', href: 'mailto:i.rarsh@gmail.com', icon: 'lucide:mail' },
  { label: 'RSS', href: '/rss.xml', icon: 'lucide:rss' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      :target="link.href.startsWith('http') ? '_blank' : undefined"
      rel="noopener noreferrer"
      :title="link.label === 'X' ? 'X / Twitter' : link.label"
      :aria-label="link.label === 'X' ? 'X / Twitter' : link.label"
      class="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-semibold text-zinc-600 no-underline transition hover:bg-zinc-100 hover:text-fuchsia-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-fuchsia-300"
      :class="showLabels ? 'w-auto' : 'w-8'"
    >
      <svg v-if="link.icon === 'x'" viewBox="0 0 24 24" aria-hidden="true" class="size-4 fill-current">
        <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.6 4H5.7l12 15.9Z" />
      </svg>
      <Icon v-else :name="link.icon" class="size-4" />
      <span v-if="showLabels">{{ link.label === 'X' ? 'X / Twitter' : link.label }}</span>
    </a>
  </div>
</template>

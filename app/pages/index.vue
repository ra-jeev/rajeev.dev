<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .limit(4)
  .all())

const { data: projects } = await useAsyncData('home-projects', () => queryCollection('projects')
  .order('order', 'ASC')
  .all())

const recentPosts = computed(() => posts.value || [])
const featuredProjects = computed(() => (projects.value || []).filter(project => project.featured).slice(0, 4))

const links = [
  { label: 'GitHub', href: 'https://github.com/ra-jeev', icon: 'lucide:github' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/rajeev.dev', icon: 'lucide:cloud' },
  { label: 'Twitter', href: 'https://twitter.com/ra_jeeves', icon: 'lucide:message-circle' },
  { label: 'RSS', href: '/rss.xml', icon: 'lucide:rss' },
]

useSeoMeta({
  title: 'Home',
  description: 'Rajeev builds and writes about Nuxt, Cloudflare, AI, and useful software experiments.',
  ogTitle: 'Rajeev',
  ogDescription: 'Writing, projects, experiments, and notes from Rajeev.',
})
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-5 sm:px-6">
    <section class="py-14 sm:py-18">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Rajeev</p>
      <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl dark:text-zinc-100">
        I build small useful software and write down what I learn.
      </h1>
      <div class="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        <p>
          This is my home base for articles, experiments, shipped apps, and the occasional note from the edges of Nuxt, Cloudflare, AI, and developer tooling.
        </p>
        <p>
          Some projects are open source, some are private production apps, and many began as blog posts that got just useful enough to keep around.
        </p>
      </div>
      <div class="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
        <NuxtLink to="/blog" class="inline-flex items-center gap-1.5 text-zinc-700 no-underline hover:text-fuchsia-700 dark:text-zinc-300 dark:hover:text-fuchsia-300">
          Writing
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
        <NuxtLink to="/projects" class="inline-flex items-center gap-1.5 text-zinc-700 no-underline hover:text-fuchsia-700 dark:text-zinc-300 dark:hover:text-fuchsia-300">
          Projects
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
        <NuxtLink to="/about" class="inline-flex items-center gap-1.5 text-zinc-700 no-underline hover:text-fuchsia-700 dark:text-zinc-300 dark:hover:text-fuchsia-300">
          About
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </section>

    <section class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Writing</p>
          <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Recent posts</h2>
        </div>
        <NuxtLink to="/blog" class="hidden items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-fuchsia-700 sm:inline-flex dark:text-zinc-400 dark:hover:text-fuchsia-300">
          All posts
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
        <article v-for="post in recentPosts" :key="post.path" class="py-5 first:pt-0">
          <NuxtLink :to="post.path" class="group block no-underline">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <h3 class="text-lg font-semibold leading-snug text-zinc-950 group-hover:text-fuchsia-700 dark:text-zinc-100 dark:group-hover:text-fuchsia-300">
                {{ post.title }}
              </h3>
              <time :datetime="post.date" class="shrink-0 text-sm text-zinc-500 dark:text-zinc-500">
                {{ new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </time>
            </div>
            <p v-if="post.description" class="mt-2 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
              {{ post.description }}
            </p>
          </NuxtLink>
        </article>
      </div>
    </section>

    <section v-if="featuredProjects.length" class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Projects</p>
          <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Selected work</h2>
        </div>
        <NuxtLink to="/projects" class="hidden items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-fuchsia-700 sm:inline-flex dark:text-zinc-400 dark:hover:text-fuchsia-300">
          All projects
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="project in featuredProjects"
          :key="project.title"
          class="border-t border-zinc-200 pt-5 dark:border-zinc-800"
        >
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-zinc-950 dark:text-zinc-100">{{ project.title }}</h3>
            <span class="rounded-full border border-fuchsia-200 px-2 py-0.5 text-xs font-medium capitalize text-fuchsia-700 dark:border-fuchsia-900/70 dark:text-fuchsia-300">
              {{ project.source === 'private' ? 'private' : project.status }}
            </span>
          </div>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {{ project.description }}
          </p>
          <ProjectLinks :project="project" class="mt-4" />
        </article>
      </div>
    </section>

    <section class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Elsewhere</p>
      <div class="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="inline-flex items-center gap-1.5 text-zinc-700 no-underline hover:text-fuchsia-700 dark:text-zinc-300 dark:hover:text-fuchsia-300"
          rel="noopener noreferrer"
        >
          <Icon :name="link.icon" class="size-4" />
          {{ link.label }}
        </a>
      </div>
    </section>
  </div>
</template>

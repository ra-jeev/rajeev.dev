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

useSeoMeta({
  title: 'Home',
  description: 'Rajeev builds small software, ships useful web apps, and writes about the process.',
  ogTitle: 'Rajeev',
  ogDescription: 'Writing, projects, shipped apps, and experiments from Rajeev.',
})
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-5 sm:px-6">
    <section class="py-14 sm:py-18">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Rajeev</p>
      <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl dark:text-zinc-100">
        I build useful web apps and write about the decisions behind them.
      </h1>
      <div class="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        <p>
          This is my home base for shipped projects, small experiments, and practical notes from working with Nuxt, Cloudflare, AI tools, and developer workflows.
        </p>
        <p>
          The through-line is usually the same: take a small idea seriously, make it usable, and write down what was learned along the way.
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
          <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Recent writing</h2>
        </div>
        <NuxtLink to="/blog" class="hidden items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-fuchsia-700 sm:inline-flex dark:text-zinc-400 dark:hover:text-fuchsia-300">
          All posts
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
        <article v-for="post in recentPosts" :key="post.path" class="py-5 first:pt-0">
          <NuxtLink :to="post.path" class="group block no-underline">
            <h3 class="text-lg font-semibold leading-snug text-zinc-950 group-hover:text-fuchsia-700 dark:text-zinc-100 dark:group-hover:text-fuchsia-300">
              {{ post.title }}
            </h3>
            <time :datetime="post.date" class="mt-2 block text-sm text-zinc-500 dark:text-zinc-500">
              {{ new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </time>
            <p v-if="post.description" class="mt-2 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
              {{ post.description }}
            </p>
            <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag"
                class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                {{ tag }}
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </section>

    <section v-if="featuredProjects.length" class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Projects</p>
          <h2 class="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Selected projects</h2>
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
          <div class="flex items-start justify-between gap-3">
            <h3 class="flex min-w-0 items-center gap-2 font-semibold text-zinc-950 dark:text-zinc-100">
              {{ project.title }}
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                title="Open live project"
                :aria-label="`Open ${project.title}`"
                class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 no-underline transition hover:bg-zinc-100 hover:text-fuchsia-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-fuchsia-300"
              >
                <Icon name="lucide:external-link" class="size-4" />
              </a>
            </h3>
            <ProjectLinks :project="project" class="shrink-0" />
          </div>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {{ project.description }}
          </p>
        </article>
      </div>
    </section>

    <section class="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">Elsewhere</p>
      <SiteSocialLinks show-labels class="mt-4" />
    </section>
  </div>
</template>

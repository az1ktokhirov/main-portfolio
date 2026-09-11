<script setup lang="ts">
import { nextProject, projectBySlug } from '~/data/projects'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const slug = computed(() => String(route.params.slug))
const project = computed(() => projectBySlug(slug.value))

// Неизвестный slug — честная 404, а не пустая страница с заголовком.
if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true,
  })
}

const copy = computed(() => (locale.value === 'en' ? project.value!.en : project.value!.ru))
const next = computed(() => nextProject(slug.value))
const nextCopy = computed(() => {
  if (!next.value)
    return undefined
  return locale.value === 'en' ? next.value.en : next.value.ru
})

useHead(() => ({ title: `${project.value!.title} — ${copy.value.tagline}` }))

useSeoMeta({
  description: () => copy.value.tagline,
  ogTitle: () => `${project.value!.title} — ${copy.value.tagline}`,
  ogDescription: () => copy.value.challenge,
})

const blocks = computed(() => [
  { key: 'challenge', label: t('case.challenge'), body: copy.value.challenge },
  { key: 'solution', label: t('case.solution'), body: copy.value.solution },
  { key: 'result', label: t('case.result'), body: copy.value.result },
])
</script>

<template>
  <article v-if="project" class="pt-28 lg:pt-36">
    <!-- Оттенок проекта задаётся один раз и подхватывается всеми детьми -->
    <div class="container-page" :style="{ '--hue': project.hue }">
      <NuxtLink
        :to="`${localePath('/')}#work`"
        class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-bone-faint transition-colors hover:text-bone"
      >
        <span aria-hidden="true">←</span>
        {{ t('case.back') }}
      </NuxtLink>

      <header class="mt-10 border-b border-white/8 pb-14">
        <p class="font-mono text-sm text-bone-faint">
          {{ project.index }} — {{ copy.category }}
        </p>

        <h1 class="case-title mt-5 text-[clamp(2.75rem,9vw,6.5rem)] font-bold">
          {{ project.title }}
        </h1>

        <p class="mt-6 max-w-2xl text-xl leading-relaxed text-bone-dim">
          {{ copy.tagline }}
        </p>

        <div class="mt-10 flex flex-wrap gap-4">
          <a
            v-if="project.live"
            :href="project.live"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
          >
            {{ t('case.live') }} ↗
          </a>
          <a
            v-if="project.source"
            :href="project.source"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition-colors hover:border-bone"
          >
            {{ t('case.source') }} ↗
          </a>
        </div>
      </header>

      <figure v-if="project.cover" v-reveal class="case-cover mt-14">
        <img
          :src="project.cover"
          :alt="`${project.title} — ${copy.tagline}`"
          decoding="async"
          width="1280"
          height="800"
        >
      </figure>

      <div class="grid gap-14 py-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
        <div class="space-y-12">
          <section v-for="block in blocks" :key="block.key" v-reveal>
            <h2 class="eyebrow">
              {{ block.label }}
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-bone-dim">
              {{ block.body }}
            </p>
          </section>
        </div>

        <aside v-reveal="{ delay: 0.1 }" class="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div>
            <h2 class="eyebrow">
              {{ t('case.role') }}
            </h2>
            <p class="mt-3 text-bone-dim">
              {{ copy.role }}
            </p>
          </div>
          <div class="border-t border-white/8 pt-6">
            <h2 class="eyebrow">
              {{ t('case.stack') }}
            </h2>
            <ul class="mt-4 flex flex-wrap gap-2">
              <li
                v-for="tech in project.stack"
                :key="tech"
                class="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-bone-dim"
              >
                {{ tech }}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <NuxtLink
      v-if="next && nextCopy"
      :to="localePath(`/work/${next.slug}`)"
      class="group block border-t border-white/8 py-16 transition-colors hover:bg-ink-raised/60 lg:py-20"
    >
      <div class="container-page">
        <p class="eyebrow">
          {{ t('case.next') }}
        </p>
        <div class="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <h2 class="font-display text-[clamp(2rem,6vw,4rem)] font-bold transition-transform duration-500 group-hover:translate-x-2">
            {{ next.title }}
          </h2>
          <p class="text-bone-dim">
            {{ nextCopy.tagline }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
/* Обложка на подложке с оттенком проекта: скриншот на голом чёрном
   выглядит вырезанным, рамка и свечение возвращают его в композицию. */
.case-cover {
  margin: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 1rem;
  background: hsl(var(--hue) 60% 50% / 6%);
  box-shadow: 0 2rem 5rem hsl(var(--hue) 70% 40% / 12%);
}

.case-cover img {
  display: block;
  width: 100%;
  height: auto;
}

.case-title {
  background: linear-gradient(
    180deg,
    var(--color-bone) 30%,
    hsl(var(--hue) 80% 62%) 130%
  );
  background-clip: text;
  color: transparent;
}
</style>

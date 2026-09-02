<script setup lang="ts">
import { projects } from '~/data/projects'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Скриншотов пока нет, поэтому список сделан типографским указателем,
// а не сеткой карточек с пустыми местами под картинки.
const copy = (project: typeof projects[number]) =>
  locale.value === 'en' ? project.en : project.ru
</script>

<template>
  <section id="work" class="scroll-mt-24 py-24 lg:py-36">
    <div class="container-page">
      <BaseSectionHeading
        :eyebrow="t('work.eyebrow')"
        :title="t('work.title')"
        :lead="t('work.lead')"
      />

      <ul class="mt-16 border-t border-white/8">
        <li v-for="project in projects" :key="project.slug" v-reveal>
          <NuxtLink
            :to="localePath(`/work/${project.slug}`)"
            class="work-row group grid items-baseline gap-x-8 gap-y-3 border-b border-white/8 py-8 lg:grid-cols-[4rem_1fr_auto] lg:py-10"
            :style="{ '--hue': project.hue }"
          >
            <span class="font-mono text-sm text-bone-faint transition-colors group-hover:text-accent">
              {{ project.index }}
            </span>

            <div class="min-w-0">
              <h3 class="work-row__title font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-bone-dim">
                {{ copy(project).tagline }}
              </p>
              <ul class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="tech in project.stack"
                  :key="tech"
                  class="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-bone-faint"
                >
                  {{ tech }}
                </li>
              </ul>
            </div>

            <span class="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-bone-faint transition-colors group-hover:text-bone lg:self-center">
              {{ t('work.viewCase') }}
              <span class="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.work-row {
  position: relative;
  transition: color 500ms var(--ease-out-expo);
}

/*
 * Подсветка строки собственным оттенком проекта. Рисуем псевдоэлементом
 * с отрицательными отступами, чтобы свечение выходило за границы ряда
 * и не резалось по краю списка.
 */
.work-row::before {
  content: '';
  position: absolute;
  inset: 0 -1.5rem;
  border-radius: 1rem;
  background: radial-gradient(
    60% 120% at 20% 50%,
    hsl(var(--hue) 90% 60% / 12%) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 500ms var(--ease-out-expo);
  pointer-events: none;
}

.work-row:hover::before,
.work-row:focus-visible::before {
  opacity: 1;
}

.work-row__title {
  transition: transform 600ms var(--ease-out-expo), color 400ms ease;
}

@media (prefers-reduced-motion: no-preference) {
  .work-row:hover .work-row__title {
    transform: translateX(0.5rem);
  }
}

.work-row:hover .work-row__title {
  color: hsl(var(--hue) 85% 68%);
}
</style>

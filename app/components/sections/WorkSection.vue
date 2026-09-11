<script setup lang="ts">
import { projects } from '~/data/projects'

const { t, locale } = useI18n()
const localePath = useLocalePath()

/*
 * Список остаётся типографским указателем, а обложка — необязательным
 * дополнением справа. Так строка выглядит законченной и с картинкой,
 * и без неё: пустых мест под ненайденные скриншоты не остаётся.
 */
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
            class="work-row group grid items-baseline gap-x-8 gap-y-3 border-b border-white/8 py-8 lg:grid-cols-[4rem_1fr_auto_auto] lg:py-10"
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

            <div v-if="project.cover" class="work-row__cover lg:self-center">
              <img
                :src="project.cover"
                :alt="`${project.title} — ${copy(project).tagline}`"
                loading="lazy"
                decoding="async"
                width="320"
                height="200"
              >
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

/* Обложка узкая и приглушённая: список должен читаться по названиям,
   картинка здесь — подсказка, а не главный элемент. */
.work-row__cover {
  width: 10rem;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 0.625rem;
}

.work-row__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
  transition: opacity 500ms var(--ease-out-expo), transform 700ms var(--ease-out-expo);
}

.work-row:hover .work-row__cover img,
.work-row:focus-visible .work-row__cover img {
  opacity: 1;
  transform: scale(1.04);
}

@media (max-width: 1023px) {
  .work-row__cover {
    width: 100%;
    max-width: 18rem;
  }
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

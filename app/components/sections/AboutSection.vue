<script setup lang="ts">
import { site, stackGroups } from '~/data/site'

const { t, tm, rt, locale } = useI18n()

const paragraphs = computed(() => (tm('about.paragraphs') as unknown[]).map(p => rt(p as string)))
const localeKey = computed(() => (locale.value === 'en' ? 'en' : 'ru') as 'ru' | 'en')
</script>

<template>
  <section id="about" class="scroll-mt-24 py-24 lg:py-36">
    <div class="container-page grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div>
        <BaseSectionHeading :eyebrow="t('about.eyebrow')" :title="t('about.title')" />

        <div class="mt-8 space-y-5">
          <p
            v-for="(paragraph, i) in paragraphs"
            :key="i"
            v-reveal="{ delay: i * 0.05 }"
            class="text-lg leading-relaxed text-bone-dim"
          >
            {{ paragraph }}
          </p>
        </div>

        <div v-reveal class="mt-10 flex flex-wrap items-center gap-4">
          <a
            :href="site.resume"
            download
            class="rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {{ t('about.resume') }}
          </a>
          <p class="font-mono text-xs uppercase tracking-widest text-bone-faint">
            {{ site.location[localeKey] }}
          </p>
        </div>
      </div>

      <div v-reveal="{ delay: 0.1 }">
        <h3 class="eyebrow">
          {{ t('about.stackTitle') }}
        </h3>

        <dl class="mt-6 space-y-6">
          <div
            v-for="group in stackGroups"
            :key="group.id"
            class="border-t border-white/8 pt-5"
          >
            <dt class="font-mono text-xs uppercase tracking-widest text-bone-faint">
              {{ group.label[localeKey] }}
            </dt>
            <dd class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="item in group.items"
                :key="item"
                class="rounded-full bg-white/5 px-3.5 py-1.5 text-sm text-bone-dim"
              >
                {{ item }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

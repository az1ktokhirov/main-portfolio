<script setup lang="ts">
import { site, socials } from '~/data/site'

const { t } = useI18n()

const telegram = computed(() => socials.find(s => s.id === 'telegram'))
const secondary = computed(() => socials.filter(s => !s.primary))
</script>

<template>
  <section id="contact" class="scroll-mt-24 border-t border-white/5 py-24 lg:py-36">
    <div class="container-page">
      <p v-reveal class="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-bone-dim">
        <span class="relative flex size-2">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60" />
          <span class="relative inline-flex size-2 rounded-full bg-green-400" />
        </span>
        {{ t('contact.available') }}
      </p>

      <h2 v-reveal="{ delay: 0.06 }" class="mt-6 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-bold">
        {{ t('contact.title') }}
      </h2>

      <p v-reveal="{ delay: 0.12 }" class="mt-6 max-w-xl text-lg leading-relaxed text-bone-dim">
        {{ t('contact.lead') }}
      </p>

      <div v-reveal="{ delay: 0.18 }" class="mt-12 flex flex-wrap gap-4">
        <a
          v-if="telegram"
          :href="telegram.url"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full bg-accent px-8 py-4 font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          {{ t('contact.telegram') }}
        </a>
        <a
          :href="`mailto:${site.email}`"
          class="rounded-full border border-white/15 px-8 py-4 font-medium transition-colors hover:border-bone"
        >
          {{ t('contact.email') }}
        </a>
      </div>

      <dl v-reveal="{ delay: 0.24 }" class="mt-16 grid gap-8 border-t border-white/8 pt-10 sm:grid-cols-3">
        <div>
          <dt class="eyebrow">
            Email
          </dt>
          <dd class="mt-2">
            <a :href="`mailto:${site.email}`" class="break-all transition-colors hover:text-accent">
              {{ site.email }}
            </a>
          </dd>
        </div>
        <div>
          <dt class="eyebrow">
            {{ t('contact.phone') }}
          </dt>
          <dd class="mt-2">
            <a :href="`tel:${site.phone}`" class="transition-colors hover:text-accent">
              {{ site.phoneDisplay }}
            </a>
          </dd>
        </div>
        <div>
          <dt class="eyebrow">
            {{ t('contact.orFind') }}
          </dt>
          <dd class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <a
              v-for="s in secondary"
              :key="s.id"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-accent"
            >{{ s.label }}</a>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

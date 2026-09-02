<script setup lang="ts">
import { site, socials } from '~/data/site'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/5 py-12">
    <div class="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div class="space-y-3">
        <NuxtLink to="/" class="font-display text-lg font-bold">
          az1k<span class="text-accent">.</span>
        </NuxtLink>
        <p class="text-sm text-bone-faint">
          © {{ year }} {{ site.nameLatin }}. {{ t('footer.rights') }}.
        </p>
      </div>

      <div class="flex flex-col gap-4 md:items-end">
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li v-for="s in socials" :key="s.id">
            <a
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-bone-dim transition-colors hover:text-accent"
            >{{ s.label }}</a>
          </li>
        </ul>
        <p class="font-mono text-xs text-bone-faint">
          {{ t('footer.builtWith') }}
        </p>
      </div>
    </div>
  </footer>
</template>

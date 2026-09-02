<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <p class="font-mono text-sm text-accent">
      {{ error.statusCode }}
    </p>
    <h1 class="mt-4 text-[clamp(2rem,7vw,4rem)] font-bold">
      {{ error.statusCode === 404 ? t('case.notFound') : error.statusMessage }}
    </h1>
    <p v-if="error.statusCode === 404" class="mt-5 max-w-md text-bone-dim">
      {{ t('case.notFoundLead') }}
    </p>
    <NuxtLink
      :to="localePath('/')"
      class="mt-10 rounded-full bg-accent px-7 py-3.5 font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
      @click="clearError({ redirect: localePath('/') })"
    >
      {{ t('work.all') }}
    </NuxtLink>
  </div>
</template>

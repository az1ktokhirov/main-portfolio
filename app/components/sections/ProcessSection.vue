<script setup lang="ts">
import { processOrder } from '~/data/site'

const { t } = useI18n()
</script>

<template>
  <section id="process" class="scroll-mt-24 border-y border-white/5 bg-ink-raised/40 py-24 lg:py-36">
    <div class="container-page">
      <BaseSectionHeading
        :eyebrow="t('process.eyebrow')"
        :title="t('process.title')"
        :lead="t('process.lead')"
      />

      <ol class="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <li
          v-for="(step, i) in processOrder"
          :key="step"
          v-reveal="{ delay: i * 0.06 }"
          class="relative"
        >
          <!-- Линия связывает шаги в последовательность; у последнего её нет -->
          <div class="flex items-center gap-4">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-sm text-accent">
              {{ i + 1 }}
            </span>
            <span
              v-if="i < processOrder.length - 1"
              class="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent"
              aria-hidden="true"
            />
          </div>

          <h3 class="mt-6 font-display text-xl font-bold">
            {{ t(`process.steps.${step}.title`) }}
          </h3>
          <p class="mt-1.5 font-mono text-xs uppercase tracking-widest text-accent/80">
            {{ t(`process.steps.${step}.duration`) }}
          </p>
          <p class="mt-4 leading-relaxed text-bone-dim">
            {{ t(`process.steps.${step}.description`) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

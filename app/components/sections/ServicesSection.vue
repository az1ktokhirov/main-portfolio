<script setup lang="ts">
import { serviceOrder, servicePricing } from '~/data/site'

const { t, tm, rt } = useI18n()

const services = computed(() => serviceOrder.map(id => ({
  id,
  price: servicePricing[id],
  features: (tm(`services.items.${id}.features`) as unknown[]).map(f => rt(f as string)),
})))
</script>

<template>
  <section id="services" class="scroll-mt-24 py-24 lg:py-36">
    <div class="container-page">
      <BaseSectionHeading
        :eyebrow="t('services.eyebrow')"
        :title="t('services.title')"
        :lead="t('services.lead')"
      />

      <div class="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2">
        <article
          v-for="(service, i) in services"
          :key="service.id"
          v-reveal="{ delay: i * 0.05 }"
          class="group flex flex-col bg-ink p-8 transition-colors duration-500 hover:bg-ink-raised lg:p-10"
        >
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="font-display text-xl font-bold lg:text-2xl">
              {{ t(`services.items.${service.id}.title`) }}
            </h3>
            <p class="shrink-0 font-mono text-sm text-accent">
              <span class="text-bone-faint">{{ t('services.priceFrom') }}</span> {{ service.price }}
            </p>
          </div>

          <p class="mt-4 leading-relaxed text-bone-dim">
            {{ t(`services.items.${service.id}.description`) }}
          </p>

          <ul class="mt-7 space-y-2.5 border-t border-white/8 pt-7">
            <li
              v-for="feature in service.features"
              :key="feature"
              class="flex items-start gap-3 text-sm text-bone-dim"
            >
              <span class="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {{ feature }}
            </li>
          </ul>

          <p class="mt-auto pt-7 font-mono text-xs uppercase tracking-widest text-bone-faint">
            {{ t(`services.items.${service.id}.duration`) }}
          </p>
        </article>
      </div>

      <p v-reveal class="mt-8 text-sm text-bone-faint">
        {{ t('services.footnote') }}
      </p>
    </div>
  </section>
</template>

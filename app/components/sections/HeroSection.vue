<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

// tm возвращает сырые сообщения — единственный способ достать массив из словаря.
const ticker = computed(() => (tm('hero.ticker') as unknown[]).map(item => rt(item as string)))
</script>

<template>
  <section class="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 lg:pt-28">
    <!-- Сцена уходит вправо на широких экранах, чтобы не спорить с текстом -->
    <div class="pointer-events-none absolute inset-0 opacity-45 lg:left-[38%] lg:opacity-100">
      <HeroVisual />
    </div>

    <!--
      Затемнение под текстом: поверх свечения шрифт иначе теряет контраст.
      Обрыв градиента сдвинут к 60%, чтобы колонка с текстом целиком
      лежала на плотном фоне, а фигура начиналась уже за ней.
    -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink/90 lg:bg-gradient-to-r lg:from-ink lg:from-30% lg:via-ink/80 lg:via-60% lg:to-transparent"
      aria-hidden="true"
    />

    <div class="container-page relative flex flex-1 items-center py-12">
      <div class="max-w-2xl">
        <p class="eyebrow hero-reveal" style="--delay: 0ms">
          {{ t('hero.eyebrow') }}
        </p>

        <h1 class="mt-6 text-[clamp(2.5rem,8vw,5.5rem)] font-bold">
          <span class="block hero-reveal" style="--delay: 80ms">{{ t('hero.titleLine1') }}</span>
          <span class="block text-accent hero-reveal" style="--delay: 160ms">{{ t('hero.titleLine2') }}</span>
          <span class="block hero-reveal" style="--delay: 240ms">{{ t('hero.titleLine3') }}</span>
        </h1>

        <p class="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim hero-reveal" style="--delay: 340ms">
          {{ t('hero.lead') }}
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-4 hero-reveal" style="--delay: 420ms">
          <a
            href="#contact"
            class="rounded-full bg-accent px-7 py-3.5 font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            {{ t('hero.ctaPrimary') }}
          </a>
          <a
            href="#work"
            class="rounded-full border border-white/15 px-7 py-3.5 font-medium transition-colors hover:border-bone"
          >
            {{ t('hero.ctaSecondary') }}
          </a>
        </div>
      </div>
    </div>

    <div class="relative border-y border-white/5 bg-ink/40 py-3.5 backdrop-blur-sm">
      <BaseMarquee :items="ticker" />
    </div>
  </section>
</template>

<style scoped>
.hero-reveal {
  animation: hero-in 900ms var(--ease-out-expo) both;
  animation-delay: var(--delay, 0ms);
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-reveal {
    animation: none;
  }
}
</style>

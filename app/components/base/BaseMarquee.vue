<script setup lang="ts">
withDefaults(defineProps<{
  items: string[]
  /** Полный проход ленты, секунды */
  duration?: number
}>(), {
  duration: 34,
})
</script>

<template>
  <div class="marquee" :style="{ '--duration': `${duration}s` }">
    <!--
      Лента дублируется: первая копия уезжает ровно на свою ширину,
      вторая в этот момент занимает её место — шва не видно.
      Дубль скрыт от скринридеров, иначе текст читается дважды.
    -->
    <div v-for="copy in 2" :key="copy" class="marquee__track" :aria-hidden="copy === 2 ? 'true' : undefined">
      <span v-for="(item, i) in items" :key="i" class="marquee__item">
        <span class="text-accent">◆</span>
        {{ item }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.marquee__track {
  display: flex;
  flex-shrink: 0;
  gap: 2.5rem;
  padding-right: 2.5rem;
  min-width: max-content;
  animation: marquee-scroll var(--duration) linear infinite;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: var(--color-bone-dim);
  white-space: nowrap;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}

/* Без движения лента просто стоит — содержимое остаётся читаемым */
@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
}
</style>

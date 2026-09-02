<script setup lang="ts">
/*
 * Решает, что показать на месте 3D-сцены.
 *
 * Канвас поднимается только когда: страница уже отрисована, WebGL есть
 * и пользователь не просил убрать анимацию. Во всех остальных случаях
 * остаётся статичный градиент — он же виден при SSR и до простоя,
 * поэтому первый экран никогда не бывает пустым.
 */
const { t } = useI18n()

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
const isCompact = useMediaQuery('(max-width: 767px)')

const canRender = ref(false)
const isReady = ref(false)

onMounted(() => {
  canRender.value = detectWebGL()
  onIdle(() => {
    isReady.value = true
  })
})

const showScene = computed(() =>
  isReady.value && canRender.value && !prefersReducedMotion.value,
)

// Меньше треугольников и меньше пикселей там, где их некому считать.
const detail = computed(() => {
  if (isCompact.value)
    return 4
  return isLowPowerDevice() ? 5 : 6
})

const dpr = computed<[number, number]>(() =>
  isCompact.value || isLowPowerDevice() ? [1, 1.5] : [1, 2],
)
</script>

<template>
  <div class="hero-visual" role="img" :aria-label="t('a11y.sceneFallback')">
    <div class="hero-visual__fallback" :class="{ 'is-hidden': showScene }" aria-hidden="true">
      <div class="hero-visual__orb" />
    </div>

    <ClientOnly>
      <LazyHeroScene v-if="showScene" :detail="detail" :dpr="dpr" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.hero-visual {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/*
 * Размер канваса задаёт сам TresJS по размеру родителя. Своих !important
 * здесь быть не должно: они переопределяют CSS-размер, но не трогают
 * буфер отрисовки, и сцена начинает рендериться в 300×150, а потом
 * растягиваться — отсюда рваные края и мыло.
 */
.hero-visual :deep(canvas) {
  display: block;
}

/* Держим подложку под канвасом: пока сцена поднимается, экран не пустой. */
.hero-visual__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition: opacity 900ms var(--ease-out-expo);
}

.hero-visual__fallback.is-hidden {
  opacity: 0;
}

/*
 * Статичный двойник шейдера: тёмная сердцевина, синий подпал и тёплый
 * ободок по краю — те же три цвета, что в GLSL.
 */
.hero-visual__orb {
  width: min(62vmin, 34rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgb(255 122 77 / 42%) 0%, transparent 38%),
    radial-gradient(circle at 70% 72%, rgb(74 58 255 / 55%) 0%, transparent 52%),
    radial-gradient(circle at 50% 50%, #1b1550 0%, #0a0a1e 62%, #08090c 100%);
  box-shadow:
    inset 0 0 6rem rgb(0 0 0 / 65%),
    0 0 9rem rgb(74 58 255 / 22%);
  filter: blur(0.4px);
}

@media (prefers-reduced-motion: no-preference) {
  .hero-visual__orb {
    animation: orb-drift 14s ease-in-out infinite;
  }
}

@keyframes orb-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(0, -1.5%, 0) scale(1.03);
  }
}
</style>

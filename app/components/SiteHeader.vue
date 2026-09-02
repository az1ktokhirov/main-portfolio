<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const sections = ['services', 'work', 'process', 'about'] as const

// Якоря работают и со страницы кейса: путь до главной строим явно.
const home = computed(() => localePath('/'))
const anchor = (id: string) => `${home.value === '/' ? '' : home.value}/#${id}`.replace('//#', '/#')

const isMenuOpen = ref(false)
const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 24)

// Без приведения к { code: string }: тогда code сохраняет узкий тип
// 'ru' | 'en', который ждёт switchLocalePath.
const otherLocales = computed(() => locales.value.filter(l => l.code !== locale.value))

const route = useRoute()
watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})

// Меню на весь экран не должно оставлять страницу прокручиваемой под собой.
watch(isMenuOpen, (open) => {
  if (import.meta.client)
    document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client)
    document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
    :class="isScrolled || isMenuOpen ? 'bg-ink/80 backdrop-blur-xl border-b border-white/5' : 'border-b border-transparent'"
  >
    <div class="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
      <NuxtLink
        :to="home"
        class="font-display text-lg font-bold tracking-tight transition-colors hover:text-accent"
      >
        az1k<span class="text-accent">.</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex" :aria-label="t('nav.menu')">
        <a
          v-for="id in sections"
          :key="id"
          :href="anchor(id)"
          class="text-sm text-bone-dim transition-colors hover:text-bone"
        >
          {{ t(`nav.${id}`) }}
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <NuxtLink
          v-for="l in otherLocales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
          class="font-mono text-xs uppercase tracking-widest text-bone-faint transition-colors hover:text-bone"
          :aria-label="t('nav.langLabel')"
        >
          {{ l.name ?? l.code }}
        </NuxtLink>

        <a
          :href="anchor('contact')"
          class="hidden rounded-full bg-bone px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent sm:inline-block"
        >
          {{ t('nav.contact') }}
        </a>

        <button
          type="button"
          class="-mr-2 flex size-10 items-center justify-center md:hidden"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? t('nav.close') : t('nav.menu')"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="relative block h-3 w-5">
            <span
              class="absolute inset-x-0 h-px bg-bone transition-transform duration-300"
              :class="isMenuOpen ? 'top-1/2 rotate-45' : 'top-0'"
            />
            <span
              class="absolute inset-x-0 h-px bg-bone transition-transform duration-300"
              :class="isMenuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'"
            />
          </span>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isMenuOpen" class="bg-ink/95 backdrop-blur-xl md:hidden">
        <nav class="container-page flex flex-col gap-1 py-6" :aria-label="t('nav.menu')">
          <a
            v-for="id in [...sections, 'contact']"
            :key="id"
            :href="anchor(id)"
            class="border-b border-white/5 py-4 font-display text-2xl transition-colors hover:text-accent"
            @click="isMenuOpen = false"
          >
            {{ t(`nav.${id}`) }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

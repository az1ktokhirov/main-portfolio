/**
 * Директива v-reveal: элемент проявляется, когда доезжает до экрана.
 *
 * Устроена так, чтобы отказ был безопасным. Скрывает элемент только сам
 * скрипт, уже в браузере: если JS не выполнился, атрибут не появится и
 * контент останется видимым. Прятать через CSS и показывать через JS —
 * значит рискнуть пустой страницей у всех, у кого скрипт не отработал.
 *
 * IntersectionObserver вместо ScrollTrigger: он срабатывает сразу и для
 * элементов, уже находящихся в зоне видимости, и не зависит от того,
 * пересчитал ли кто-то размеры страницы.
 *
 * Плагин универсальный, а не .client — директиву обязан знать и сервер,
 * иначе SSR падает на ssrGetDirectiveProps.
 */

interface RevealElement extends HTMLElement {
  _revealCleanup?: () => void
}

/** Страховка: если наблюдатель почему-то не сработал, показываем всё равно. */
const FAILSAFE_MS = 2500

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),

    mounted(el: RevealElement, binding: { value?: { delay?: number } }) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion || !('IntersectionObserver' in window))
        return

      const delay = Math.round((binding.value?.delay ?? 0) * 1000)
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.dataset.reveal = 'hidden'

      const show = () => {
        el.dataset.reveal = 'shown'
        el._revealCleanup?.()
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting))
          show()
      }, { rootMargin: '0px 0px -12% 0px' })

      observer.observe(el)
      const failsafe = window.setTimeout(show, FAILSAFE_MS)

      el._revealCleanup = () => {
        observer.disconnect()
        window.clearTimeout(failsafe)
        delete el._revealCleanup
      }
    },

    unmounted(el: RevealElement) {
      el._revealCleanup?.()
    },
  })
})

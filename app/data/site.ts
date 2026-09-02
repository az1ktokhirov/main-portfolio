/**
 * Единый источник правды по контактам, ценам и стеку.
 * Всё, что нужно править чаще всего, лежит здесь, а не размазано по компонентам.
 */

export const site = {
  name: 'Азизилло Тохиров',
  nameLatin: 'Azizillo Tokhirov',
  handle: 'az1k',
  url: 'https://az1k.dev',
  location: { ru: 'Ташкент, Узбекистан', en: 'Tashkent, Uzbekistan' },
  email: 'azizillotokhirov@gmail.com',
  phone: '+998888386668',
  phoneDisplay: '+998 88 838-66-68',
  resume: '/Azizillo-Toxirov.pdf',
} as const

export const socials = [
  { id: 'telegram', label: 'Telegram', handle: '@az1ktokhirov', url: 'https://t.me/az1ktokhirov', primary: true },
  { id: 'github', label: 'GitHub', handle: 'az1ktokhirov', url: 'https://github.com/az1ktokhirov', primary: true },
  { id: 'instagram', label: 'Instagram', handle: '@az1ktokhirov', url: 'https://www.instagram.com/az1ktokhirov', primary: false },
  { id: 'x', label: 'X', handle: '@az1ktokh1rov', url: 'https://x.com/az1ktokh1rov', primary: false },
] as const

/**
 * Цены — ЗАГЛУШКИ. Поставь свои перед публикацией.
 * Ключи совпадают с services.items.* в файлах переводов.
 */
export const servicePricing = {
  landing: '$400',
  store: '$900',
  app: '$1200',
  motion: '$300',
} as const

export type ServiceId = keyof typeof servicePricing

export const serviceOrder: ServiceId[] = ['landing', 'store', 'app', 'motion']

export const processOrder = ['brief', 'design', 'build', 'launch'] as const

/** Стек для секции «Обо мне». Сгруппирован — плоский список из 15 слов не читается. */
export const stackGroups = [
  {
    id: 'core',
    label: { ru: 'Основное', en: 'Core' },
    items: ['Vue 3', 'Nuxt', 'TypeScript', 'JavaScript'],
  },
  {
    id: 'styling',
    label: { ru: 'Вёрстка', en: 'Styling' },
    items: ['HTML5', 'CSS3', 'SCSS', 'Tailwind', 'Bootstrap'],
  },
  {
    id: 'motion',
    label: { ru: 'Графика', en: 'Graphics' },
    items: ['three.js', 'TresJS', 'GLSL', 'GSAP'],
  },
  {
    id: 'tools',
    label: { ru: 'Инструменты', en: 'Tooling' },
    items: ['Git', 'Vite', 'Pinia', 'Figma'],
  },
] as const

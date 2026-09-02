/**
 * Кейсы. Текст лежит рядом с проектом, а не в файлах переводов —
 * так его проще править: весь кейс виден целиком в одном месте.
 *
 * needsReview: true — описание собрано по опубликованному сайту.
 * Проверь стек и детали перед публикацией.
 */

export interface ProjectCopy {
  tagline: string
  category: string
  role: string
  challenge: string
  solution: string
  result: string
}

export interface Project {
  slug: string
  title: string
  /** Порядковый номер в списке, выводится как 01 / 02 / … */
  index: string
  live?: string
  source?: string
  stack: string[]
  /** Оттенок свечения карточки, градусы HSL */
  hue: number
  needsReview?: boolean
  ru: ProjectCopy
  en: ProjectCopy
}

export const projects: Project[] = [
  {
    slug: 'sun-light',
    title: 'Sun Light',
    index: '01',
    live: 'https://lampshop.vercel.app/',
    stack: ['HTML5', 'SCSS', 'JavaScript', 'Swiper', 'ScrollReveal'],
    hue: 32,
    ru: {
      tagline: 'Магазин освещения с корзиной и тёмной темой',
      category: 'Интернет-магазин',
      role: 'Дизайн и разработка',
      challenge:
        'Магазину ламп нужна была витрина, где товар добавляется в корзину и сумма пересчитывается мгновенно — без перезагрузки страницы и без тяжёлой CMS за спиной.',
      solution:
        'Собрал витрину на чистом JavaScript, без фреймворков. Корзина считает количество и общую сумму на лету, популярные позиции крутятся в слайдере Swiper, блоки проявляются по мере скролла. Добавил переключатель светлой и тёмной темы — лампы логичнее всего показывать в темноте.',
      result:
        'Страница почти ничего не весит: только вёрстка и ванильный JS, ни одного мегабайта фреймворка. Каталог, корзина и аккордеон с вопросами одинаково работают от 320 пикселей до широкого монитора.',
    },
    en: {
      tagline: 'A lighting store with a live cart and a dark mode',
      category: 'Online store',
      role: 'Design & development',
      challenge:
        'The shop needed a storefront where products drop into a cart and the total recalculates instantly — with no page reloads and no heavy CMS behind it.',
      solution:
        'I built the storefront in plain JavaScript, no framework. The cart tracks quantities and the running total live, featured products sit in a Swiper carousel, and sections reveal themselves on scroll. I added a light/dark toggle — lamps make the most sense shown in the dark.',
      result:
        'The page weighs almost nothing: markup and vanilla JS, not a megabyte of framework. Catalogue, cart and the FAQ accordion all behave identically from 320 pixels up to a wide monitor.',
    },
  },
  {
    slug: 'azt-store',
    title: 'AZT Store',
    index: '02',
    live: 'https://azt-store.vercel.app/',
    stack: ['Vue 3', 'Vite', 'Vue Router', 'SCSS'],
    hue: 258,
    needsReview: true,
    ru: {
      tagline: 'Магазин на Vue с каталогом и маршрутизацией',
      category: 'Интернет-магазин',
      role: 'Фронтенд-разработка',
      challenge:
        'Нужно было перенести витрину со статической вёрстки на компонентный подход: чтобы карточка товара, каталог и корзина жили как переиспользуемые части, а не копировались из файла в файл.',
      solution:
        'Переписал магазин на Vue 3 с Vite. Разбил интерфейс на компоненты, состояние вынес из разметки, переходы между разделами повесил на Vue Router. Сборка через Vite дала мгновенный дев-сервер и разделение бандла на части.',
      result:
        'Добавить новый раздел теперь — это один компонент и одна запись в роутере, а не копия трёхсот строк разметки. Приложение собирается в статику и раздаётся с CDN.',
    },
    en: {
      tagline: 'A Vue storefront with a component-driven catalogue',
      category: 'Online store',
      role: 'Front-end development',
      challenge:
        'The storefront had to move from static markup to a component model, so that the product card, the catalogue and the cart lived as reusable pieces instead of being copied between files.',
      solution:
        'I rebuilt the store on Vue 3 with Vite. The interface became components, state moved out of the markup, and navigation went through Vue Router. Vite gave an instant dev server and a properly split bundle.',
      result:
        'Adding a section is now one component and one route entry rather than a copy of three hundred lines of markup. The app builds to static files and ships from a CDN.',
    },
  },
  {
    slug: 'kicks',
    title: 'Kicks',
    index: '03',
    live: 'https://kickss.netlify.app/',
    stack: ['HTML5', 'SCSS', 'JavaScript'],
    hue: 152,
    needsReview: true,
    ru: {
      tagline: 'Витрина магазина кроссовок',
      category: 'Интернет-магазин',
      role: 'Вёрстка и разработка',
      challenge:
        'Магазину кроссовок нужна была витрина, которая держит внимание: товар в этой нише продаёт картинка, а не текст описания.',
      solution:
        'Сделал упор на крупные изображения и плотную сетку каталога. Интерфейс собран так, чтобы карточка товара оставалась читаемой и на витрине, и на узком экране телефона.',
      result:
        'Каталог одинаково аккуратно раскладывается на любой ширине, ключевые действия остаются в зоне большого пальца на мобильном.',
    },
    en: {
      tagline: 'A sneaker store front end',
      category: 'Online store',
      role: 'Markup & development',
      challenge:
        'A sneaker shop needed a storefront that holds attention: in this category the photograph sells the product, not the description.',
      solution:
        'I leaned on large imagery and a tight catalogue grid. The interface is built so the product card stays readable both in the grid and on a narrow phone screen.',
      result:
        'The catalogue reflows cleanly at any width, and the key actions stay inside thumb reach on mobile.',
    },
  },
  {
    slug: 'alfa-marketing',
    title: 'Alfa Marketing',
    index: '04',
    live: 'https://az1ktokhirov.github.io/test-project/',
    source: 'https://github.com/az1ktokhirov/test-project',
    stack: ['HTML5', 'SCSS', 'JavaScript', 'Bootstrap'],
    hue: 200,
    needsReview: true,
    ru: {
      tagline: 'Сайт маркетингового агентства',
      category: 'Корпоративный сайт',
      role: 'Вёрстка',
      challenge:
        'Агентству нужен был сайт-визитка, который сам по себе служит доказательством компетенции: маркетологу нельзя продавать услуги с плохо свёрстанной страницы.',
      solution:
        'Свёрстал многосекционную страницу с услугами, преимуществами и формой заявки. Сетку собрал на Bootstrap, поверх — собственные стили на SCSS, чтобы сайт не выглядел как стандартная бутстрап-тема.',
      result:
        'Страница держит сетку на всех брейкпоинтах и открывается быстро — статика без бэкенда, раздаётся напрямую с GitHub Pages.',
    },
    en: {
      tagline: 'Website for a marketing agency',
      category: 'Company website',
      role: 'Markup',
      challenge:
        'The agency needed a site that doubles as proof of competence: a marketer cannot sell services from a badly built page.',
      solution:
        'I built a multi-section page covering services, differentiators and an enquiry form. The grid runs on Bootstrap with custom SCSS layered on top, so it never reads as an off-the-shelf Bootstrap theme.',
      result:
        'The layout holds at every breakpoint and loads fast — static files with no backend, served straight from GitHub Pages.',
    },
  },
  {
    slug: 'az1k-v1',
    title: 'Az1k v1',
    index: '05',
    live: 'https://az1ktokhirov.vercel.app/',
    stack: ['Vue 3', 'Vue Router', 'Vuex', 'SCSS', 'Web Audio'],
    hue: 48,
    ru: {
      tagline: 'Первое портфолио как игровой интерфейс',
      category: 'Эксперимент',
      role: 'Идея, дизайн и разработка',
      challenge:
        'Хотелось портфолио, которое не листают, а проходят. Обычная страница «обо мне» ничего не говорит о том, умеет ли автор делать интерфейс, который держит внимание.',
      solution:
        'Собрал сайт как игровое меню: пункты навигации бегут бесконечной лентой, наведение и клик отзываются звуком через Web Audio, между разделами проигрывается свой экран загрузки. Всё на Vue 3 с Vue Router и Vuex.',
      result:
        'Проект решил ровно ту задачу, для которой задумывался, — и заодно показал границу: такой интерфейс отлично работает как эксперимент, но плохо продаёт услуги. Поэтому появился этот сайт, а v1 остался в портфолио как есть.',
    },
    en: {
      tagline: 'A first portfolio built as a game interface',
      category: 'Experiment',
      role: 'Concept, design & development',
      challenge:
        'I wanted a portfolio you play through rather than scroll past. A plain "about me" page says nothing about whether its author can build an interface that holds attention.',
      solution:
        'I built the site as a game menu: navigation items run as infinite marquees, hover and click answer with sound through Web Audio, and each section gets its own loading screen. Vue 3 throughout, with Vue Router and Vuex.',
      result:
        'It did exactly what it set out to do — and showed me the limit: an interface like this works beautifully as an experiment but sells services badly. That is why this site exists, and why v1 stays in the portfolio untouched.',
    },
  },
]

export const projectBySlug = (slug: string) => projects.find(p => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex(p => p.slug === slug)
  return i === -1 ? undefined : projects[(i + 1) % projects.length]
}

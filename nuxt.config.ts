import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

/*
 * Слаги кейсов читаются с диска на этапе сборки.
 *
 * Компоненты берут проекты через import.meta.glob, но это возможность Vite:
 * Nitro собирается rollup-ом и такой синтаксис не понимает. Поэтому список
 * собирается здесь и раздаётся дальше — в prerender.routes и в runtimeConfig
 * для карты сайта. Побочный плюс: пререндер больше не зависит от того,
 * найдёт ли краулер ссылку на кейс в разметке.
 */
const projectsDir = fileURLToPath(new URL('./content/projects', import.meta.url))

const projectSlugs = readdirSync(projectsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => file.replace(/\.json$/, ''))

/**
 * Боевой адрес сайта. Отсюда строятся canonical, hreflang и redirect_uri
 * для OAuth, поэтому домен задан один раз и в одном месте.
 */
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app'

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Unbounded:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',

  // Явное отключение: иначе панель Nuxt DevTools просачивается
  // в продакшен-сборку и висит бейджем поверх страницы.
  devtools: { enabled: false },

  modules: [
    '@tresjs/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  // Иначе TresJS тащит в продакшен интеграцию с Vue DevTools:
  // лишний чанк и видимый посетителю плавающий бейдж.
  tres: {
    devtools: false,
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Русский — язык по умолчанию и живёт на корне (/), английский на /en.
  // prefix_except_default даёт чистые URL для основной аудитории
  // и корректные hreflang для поисковиков.
  i18n: {
    // Абсолютный домен обязателен: из него строятся canonical и hreflang.
    baseUrl: SITE_URL,
    strategy: 'prefix_except_default',
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Рус', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'Eng', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'az1k_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#08090c' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        /*
         * Шрифты подключаются асинхронно: обычный <link rel="stylesheet">
         * блокирует первую отрисовку, и если Google Fonts отвечает медленно
         * или недоступен, страница стоит пустой. Приём с media="print"
         * снимает блокировку — текст сразу рисуется системным шрифтом
         * и подменяется, когда файл доедет (в URL есть display=swap).
         */
        {
          rel: 'stylesheet',
          href: FONTS_HREF,
          media: 'print',
          onload: 'this.media=\'all\'',
        },
      ],
      noscript: [
        { innerHTML: `<link rel="stylesheet" href="${FONTS_HREF}">` },
      ],
    },
  },

  // Слаги известны заранее, поэтому маршруты кейсов перечислены явно.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/en',
        '/sitemap.xml',
        ...projectSlugs.flatMap(slug => [`/work/${slug}`, `/en/work/${slug}`]),
      ],
    },
  },

  runtimeConfig: {
    // Секреты OAuth-приложения GitHub. Значения приходят из переменных
    // окружения (NUXT_GITHUB_CLIENT_ID и NUXT_GITHUB_CLIENT_SECRET) и в
    // репозиторий не попадают.
    githubClientId: '',
    githubClientSecret: '',
    /** Логины GitHub, которым разрешён вход в админку, через запятую. */
    adminGithubLogins: 'az1ktokhirov',

    public: {
      // Единственный способ передать список кейсов в серверные маршруты.
      projectSlugs,
      siteUrl: SITE_URL,
    },
  },

  future: { compatibilityVersion: 4 },
})

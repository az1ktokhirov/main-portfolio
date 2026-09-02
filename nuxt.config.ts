import tailwindcss from '@tailwindcss/vite'

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
    baseUrl: 'https://az1k.dev',
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

  // crawlLinks доходит до страниц кейсов по ссылкам из секции «Работы».
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/sitemap.xml'],
    },
  },

  future: { compatibilityVersion: 4 },
})

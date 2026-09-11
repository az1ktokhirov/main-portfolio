<script setup lang="ts">
import { site } from '~/data/site'

const { t, locale } = useI18n()
const siteUrl = useRuntimeConfig().public.siteUrl as string

// hreflang, og:locale и lang на <html> — модуль собирает их сам.
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
  titleTemplate: title => (title ? `${title} — ${site.handle}` : t('meta.title')),
}))

useSeoMeta({
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogType: 'website',
  ogImage: () => `${siteUrl}/og.png`,
  ogImageAlt: () => t('meta.ogAlt'),
  twitterCard: 'summary_large_image',
  twitterImage: () => `${siteUrl}/og.png`,
})

// Разметка для поисковиков: кто это, чем занимается, где найти.
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': locale.value === 'ru' ? site.name : site.nameLatin,
      'url': siteUrl,
      'email': `mailto:${site.email}`,
      'jobTitle': locale.value === 'ru' ? 'Фронтенд-разработчик' : 'Front-end developer',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': locale.value === 'ru' ? 'Ташкент' : 'Tashkent',
        'addressCountry': 'UZ',
      },
      'sameAs': ['https://github.com/az1ktokhirov', 'https://t.me/az1ktokhirov'],
    }),
  }],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

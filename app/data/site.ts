/**
 * Контакты, цены и стек.
 *
 * Всё, что меняется со временем, живёт в content/settings.json и правится
 * через админку на /admin. Здесь остаётся только то, что менять нельзя
 * без правки кода: имя, домен и город.
 *
 * Обычный import, а не import.meta.glob — файл ровно один и известен
 * заранее, поэтому такой импорт работает и во Vite, и в Nitro.
 */
import settings from '../../content/settings.json'

/*
 * Домена здесь намеренно нет: он живёт в nuxt.config (SITE_URL) и
 * раздаётся через runtimeConfig.public.siteUrl. Два источника правды
 * для адреса рано или поздно разъезжаются, и ломаются canonical.
 */
export const site = {
  name: 'Азизилло Тохиров',
  nameLatin: 'Azizillo Tokhirov',
  handle: 'az1k',
  location: { ru: 'Ташкент, Узбекистан', en: 'Tashkent, Uzbekistan' },
  email: settings.email,
  phone: settings.phone,
  phoneDisplay: settings.phoneDisplay,
  resume: settings.resume,
}

/** Показывать ли плашку «Свободен для новых проектов» */
export const isAvailable = settings.available

export interface Social {
  id: string
  label: string
  url: string
  primary: boolean
}

export const socials: Social[] = settings.socials

export const servicePricing = settings.pricing

export type ServiceId = keyof typeof servicePricing

export const serviceOrder: ServiceId[] = ['landing', 'store', 'app', 'motion']

export const processOrder = ['brief', 'design', 'build', 'launch'] as const

/** Стек для секции «Обо мне». Сгруппирован — плоский список из 15 слов не читается. */
export const stackGroups = settings.stackGroups.map(group => ({
  id: group.id,
  label: { ru: group.labelRu, en: group.labelEn },
  items: group.items,
}))

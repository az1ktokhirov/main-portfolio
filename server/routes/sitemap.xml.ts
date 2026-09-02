import { projects } from '../../app/data/projects'
import { site } from '../../app/data/site'

/**
 * Небольшой сайт — отдельный модуль ради карты сайта не нужен.
 * Маршрут пререндерится в статику при сборке.
 */
export default defineEventHandler((event) => {
  const paths = ['/', ...projects.map(p => `/work/${p.slug}`)]

  // Каждая страница существует в двух языках: русский на корне, английский под /en.
  const urls = paths.flatMap(path => [
    { loc: `${site.url}${path}`, locale: 'ru', alt: `${site.url}/en${path === '/' ? '' : path}` },
    { loc: `${site.url}/en${path === '/' ? '' : path}`, locale: 'en', alt: `${site.url}${path}` },
  ])

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <xhtml:link rel="alternate" hreflang="${url.locale === 'ru' ? 'en' : 'ru'}" href="${url.alt}"/>
    <changefreq>monthly</changefreq>
  </url>`).join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})

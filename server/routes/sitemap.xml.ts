/**
 * Небольшой сайт — отдельный модуль ради карты сайта не нужен.
 * Маршрут пререндерится в статику при сборке.
 *
 * Слаги берутся из runtimeConfig: они собираются в nuxt.config чтением
 * content/projects, потому что import.meta.glob здесь, в сборке Nitro,
 * недоступен.
 */
export default defineEventHandler((event) => {
  const { projectSlugs, siteUrl } = useRuntimeConfig(event).public as {
    projectSlugs: string[]
    siteUrl: string
  }

  const paths = ['/', ...projectSlugs.map(slug => `/work/${slug}`)]

  // Каждая страница существует в двух языках: русский на корне, английский под /en.
  const urls = paths.flatMap(path => [
    { loc: `${siteUrl}${path}`, locale: 'ru', alt: `${siteUrl}/en${path === '/' ? '' : path}` },
    { loc: `${siteUrl}/en${path === '/' ? '' : path}`, locale: 'en', alt: `${siteUrl}${path}` },
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

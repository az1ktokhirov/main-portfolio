/**
 * Кейсы. Сами данные лежат в content/projects/*.json — оттуда их читает
 * админка на /admin и туда же коммитит правки.
 *
 * import.meta.glob разворачивается Vite на этапе сборки: JSON встраивается
 * в бандл, на рантайме никаких обращений к файловой системе. Поэтому сайт
 * остаётся полностью статическим, хотя контент и редактируется через CMS.
 *
 * Nitro (папка server/) собирается rollup-ом и этот синтаксис не понимает.
 * Список слагов туда передаётся через runtimeConfig — см. nuxt.config.ts.
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
  /** Позиция в списке работ */
  order: number
  /** Подпись-номер: 01 / 02 / … */
  index: string
  live?: string
  source?: string
  /** Путь к обложке в public/. Пустая строка — обложки ещё нет. */
  cover?: string
  stack: string[]
  /** Оттенок свечения карточки, градусы HSL */
  hue: number
  needsReview?: boolean
  ru: ProjectCopy
  en: ProjectCopy
}

type ProjectFile = Omit<Project, 'slug'>

const files = import.meta.glob<ProjectFile>('../../content/projects/*.json', {
  eager: true,
  import: 'default',
})

export const projects: Project[] = Object.entries(files)
  .map(([path, data]) => ({
    ...data,
    // content/projects/sun-light.json → sun-light
    slug: path.split('/').pop()!.replace(/\.json$/, ''),
  }))
  // Порядок задаётся полем order, а не именами файлов: иначе список
  // перестроился бы сам собой при переименовании проекта.
  .sort((a, b) => a.order - b.order)

export const projectBySlug = (slug: string) => projects.find(p => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex(p => p.slug === slug)
  return i === -1 ? undefined : projects[(i + 1) % projects.length]
}

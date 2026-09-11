import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * Кладёт бандл Sveltia CMS в public/admin перед сборкой.
 *
 * Альтернатива — тянуть скрипт с CDN, но тогда версия админки меняется
 * сама собой и зависит от доступности стороннего домена. Копия из
 * node_modules зафиксирована в pnpm-lock вместе с остальными пакетами.
 *
 * Файл попадает в .gitignore: 2 МБ собранного кода в репозитории не нужны,
 * он восстанавливается из зависимостей на каждой сборке.
 */

const require = createRequire(import.meta.url)
const root = dirname(fileURLToPath(new URL('.', import.meta.url)))
const target = join(root, 'public', 'admin', 'sveltia-cms.mjs')

/*
 * В exports пакета открыт только корневой вход, поэтому ни './dist/...',
 * ни './package.json' напрямую не резолвятся. Берём корневой вход — это
 * и есть нужный ES-модуль сборки.
 */
const source = require.resolve('@sveltia/cms')

if (!existsSync(source)) {
  console.error(`[copy-cms] Не найден бандл CMS: ${source}`)
  console.error('[copy-cms] Установи зависимости: pnpm install')
  process.exit(1)
}

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)

console.log('[copy-cms] Админка собрана → public/admin/sveltia-cms.mjs')

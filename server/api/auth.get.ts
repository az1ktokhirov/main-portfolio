/**
 * Первый шаг входа в админку: уводим на GitHub за разрешением.
 *
 * Админка на /admin открывает этот адрес во всплывающем окне. Обратно
 * GitHub вернётся на /api/callback, который обменяет код на токен.
 */
export default defineEventHandler((event) => {
  const { githubClientId, public: { siteUrl } } = useRuntimeConfig(event)

  if (!githubClientId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GITHUB_CLIENT_ID не задан в переменных окружения',
    })
  }

  /*
   * Случайная строка против CSRF: кладём её в куку и сверяем на возврате.
   * Без этой проверки чужой запрос мог бы подсунуть свой код авторизации.
   */
  const state = crypto.randomUUID()

  setCookie(event, 'cms_oauth_state', state, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })

  const target = new URL('https://github.com/login/oauth/authorize')
  target.searchParams.set('client_id', githubClientId)
  // repo — минимальный набор прав, которого хватает CMS для коммитов
  target.searchParams.set('scope', 'repo,user')
  target.searchParams.set('state', state)
  target.searchParams.set('redirect_uri', `${siteUrl}/api/callback`)

  return sendRedirect(event, target.toString())
})

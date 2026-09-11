/**
 * Второй шаг входа: меняем код GitHub на токен и отдаём его админке.
 *
 * Обмен обязан происходить на сервере — client_secret нельзя показывать
 * браузеру. Готовый токен возвращается во всплывающее окно через
 * postMessage в формате, который понимает Sveltia CMS.
 */

interface TokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

/** Страница-посредник: передаёт результат в окно админки и закрывается. */
function renderBridge(payload: string) {
  // JSON.stringify экранирует кавычки и слэши: токен попадает в скрипт
  // как строковый литерал, а не как исполняемый код.
  const message = JSON.stringify(payload)

  return `<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><title>Авторизация</title></head>
<body style="background:#08090c;color:#edeef2;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0">
<p>Готово, окно можно закрыть.</p>
<script>
  (function () {
    var message = ${message};

    function send(event) {
      window.opener.postMessage(message, event.origin);
      window.removeEventListener('message', send, false);
    }

    if (!window.opener) {
      document.body.textContent = 'Это окно нужно открывать из админки.';
      return;
    }

    // Рукопожатие: сперва сообщаем, что готовы, затем отвечаем на отклик
    // источником, который назвала сама админка, — так токен не уходит
    // случайному окну.
    window.addEventListener('message', send, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body>
</html>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { githubClientId, githubClientSecret, adminGithubLogins } = config

  setHeader(event, 'content-type', 'text/html; charset=utf-8')

  const fail = (reason: string) =>
    renderBridge(`authorization:github:error:${JSON.stringify({ message: reason })}`)

  const { code, state } = getQuery(event) as { code?: string, state?: string }
  const expectedState = getCookie(event, 'cms_oauth_state')

  deleteCookie(event, 'cms_oauth_state', { path: '/' })

  if (!code)
    return fail('GitHub не вернул код авторизации')

  if (!state || !expectedState || state !== expectedState)
    return fail('Не совпал одноразовый ключ — попробуйте войти заново')

  if (!githubClientId || !githubClientSecret)
    return fail('На сервере не заданы GITHUB_CLIENT_ID и GITHUB_CLIENT_SECRET')

  let token: string

  try {
    const tokenResponse = await $fetch<TokenResponse>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json' },
      body: {
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
      },
    })

    if (!tokenResponse.access_token)
      return fail(tokenResponse.error_description || 'GitHub не выдал токен')

    token = tokenResponse.access_token
  }
  catch {
    return fail('Не удалось связаться с GitHub')
  }

  /*
   * Проверка логина. Приложение просит права на репозитории, поэтому без
   * этого шага любой желающий мог бы через него выписывать себе токены.
   * Права на запись в репозиторий проверяет уже сам GitHub, но выдавать
   * токен постороннему незачем.
   */
  const allowed = String(adminGithubLogins || '')
    .split(',')
    .map(login => login.trim().toLowerCase())
    .filter(Boolean)

  if (allowed.length) {
    try {
      const user = await $fetch<{ login: string }>('https://api.github.com/user', {
        headers: {
          authorization: `Bearer ${token}`,
          accept: 'application/vnd.github+json',
        },
      })

      if (!allowed.includes(user.login.toLowerCase()))
        return fail(`У пользователя ${user.login} нет доступа к этой админке`)
    }
    catch {
      return fail('Не удалось проверить, кто вошёл')
    }
  }

  return renderBridge(
    `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`,
  )
})

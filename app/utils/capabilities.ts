/**
 * Проверки возможностей устройства. Решают, показывать ли WebGL-сцену
 * и с каким качеством, — чтобы слабый телефон не пытался тянуть то же,
 * что тянет десктоп.
 */

export function detectWebGL(): boolean {
  if (typeof window === 'undefined')
    return false

  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  }
  catch {
    return false
  }
}

/**
 * Грубая, но дешёвая эвристика. Точного способа узнать мощность GPU из
 * браузера нет, а разбор строки видеокарты через WEBGL_debug_renderer_info
 * во многих браузерах уже закрыт ради приватности.
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined')
    return false

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency

  // Пороги намеренно низкие: четырёхъядерный ноутбук тянет сцену без проблем,
  // и понижать ему качество значило бы портить картинку большинству.
  if (typeof memory === 'number' && memory <= 2)
    return true

  return typeof cores === 'number' && cores <= 2
}

/** Откладывает работу до простоя, чтобы не конкурировать с гидратацией. */
export function onIdle(callback: () => void, timeout = 1500): void {
  if (typeof window === 'undefined')
    return

  if (typeof window.requestIdleCallback === 'function')
    window.requestIdleCallback(() => callback(), { timeout })
  else
    window.setTimeout(callback, 200)
}

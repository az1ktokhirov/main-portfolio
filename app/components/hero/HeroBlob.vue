<script setup lang="ts">
// Сама фигура. Живёт внутри TresCanvas — useLoop работает только там.
import { useLoop } from '@tresjs/core'
import { Color, MathUtils, Vector3 } from 'three'
import { fragmentShader, vertexShader } from './shaders'

const props = withDefaults(defineProps<{
  detail?: number
  animate?: boolean
}>(), {
  detail: 6,
  animate: true,
})

/**
 * Обычный объект, а не ref: three мутирует uniforms каждый кадр,
 * и реактивная обёртка здесь только добавила бы накладных расходов.
 */
const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: 0.28 },
  uFrequency: { value: 1.35 },
  uPointer: { value: new Vector3(0, 0, 1) },
  uPointerStrength: { value: 0 },
  uScroll: { value: 0 },
  uColorDeep: { value: new Color('#0a0a1e') },
  uColorMid: { value: new Color('#3a2ce0') },
  uColorRim: { value: new Color('#ff5a1f') },
}

const mesh = shallowRef<{ rotation: { x: number, y: number } } | null>(null)

const { x: pointerX, y: pointerY } = useMouse({ type: 'client' })
const { width, height } = useWindowSize()
const { y: scrollY } = useWindowScroll()

const targetDir = new Vector3(0, 0, 1)
const currentDir = new Vector3(0, 0, 1)
let pointerStrength = 0
let scrollAmount = 0

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta, elapsed }) => {
  if (!props.animate)
    return

  uniforms.uTime.value = elapsed

  // Экранные координаты курсора → направление на сфере перед камерой.
  const nx = (pointerX.value / Math.max(width.value, 1)) * 2 - 1
  const ny = -((pointerY.value / Math.max(height.value, 1)) * 2 - 1)
  targetDir.set(nx * 1.4, ny * 1.4, 1).normalize()

  /*
   * Коэффициент сглаживания зависит от delta, а не от номера кадра:
   * иначе на 144 Гц фигура догоняет курсор вдвое быстрее, чем на 60 Гц.
   */
  const k = 1 - 0.001 ** delta

  currentDir.lerp(targetDir, k)
  uniforms.uPointer.value.copy(currentDir)

  pointerStrength = MathUtils.lerp(pointerStrength, 1, k)
  uniforms.uPointerStrength.value = pointerStrength

  const progress = Math.min(scrollY.value / Math.max(height.value, 1), 1)
  scrollAmount = MathUtils.lerp(scrollAmount, progress, k)
  uniforms.uScroll.value = scrollAmount

  if (mesh.value) {
    mesh.value.rotation.y = elapsed * 0.08
    mesh.value.rotation.x = Math.sin(elapsed * 0.12) * 0.15
  }
})
</script>

<template>
  <TresMesh ref="mesh">
    <TresIcosahedronGeometry :args="[1, props.detail]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
    />
  </TresMesh>
</template>

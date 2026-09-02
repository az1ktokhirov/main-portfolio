<script setup lang="ts">
// Обёртка над канвасом. Грузится лениво — см. HeroVisual.vue.
import { Vector3 } from 'three'

withDefaults(defineProps<{
  detail?: number
  dpr?: [number, number]
}>(), {
  detail: 6,
  dpr: () => [1, 2],
})

/*
 * Камера отодвинута: вблизи фигура перекрывала заголовок и уходила за край.
 * Vector3, а не массив: массив TresJS принимает в рантайме, но не в типах.
 */
const cameraPosition = new Vector3(0, 0, 4.6)
</script>

<template>
  <TresCanvas
    clear-color="#08090c"
    :dpr="dpr"
    :antialias="true"
    power-preference="high-performance"
    render-mode="always"
  >
    <TresPerspectiveCamera :position="cameraPosition" :fov="40" />
    <HeroBlob :detail="detail" />
  </TresCanvas>
</template>

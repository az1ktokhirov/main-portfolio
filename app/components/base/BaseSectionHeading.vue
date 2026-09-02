<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  lead?: string
}>()
</script>

<template>
  <div class="max-w-3xl">
    <p v-reveal class="eyebrow">
      {{ eyebrow }}
    </p>
    <h2 v-reveal="{ delay: 0.06 }" class="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-bold">
      {{ title }}
    </h2>
    <p v-if="lead" v-reveal="{ delay: 0.12 }" class="mt-5 max-w-xl text-lg leading-relaxed text-bone-dim">
      {{ lead }}
    </p>
  </div>
</template>

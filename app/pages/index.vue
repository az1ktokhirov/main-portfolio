<script setup lang="ts">
const { t } = useI18n()

useHead({ title: () => t('meta.title') })
</script>

<template>
  <div>
    <SectionsHeroSection />
    <SectionsServicesSection />
    <SectionsWorkSection />
    <SectionsProcessSection />
    <SectionsAboutSection />
    <SectionsContactSection />
  </div>
</template>

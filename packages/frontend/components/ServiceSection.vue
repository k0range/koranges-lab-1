<template>
  <section class="max-w-6xl mx-auto px-5 py-6">
    <img
      :src="logoUrl"
      :alt="serviceName"
      class="h-16 mb-1.5"
    />
    <p
      v-for="line in description"
      :key="line"
      class="text-md text-[#484848] leading-7"
    >
      {{ line }}
    </p>
  </section>
</template>

<script setup lang="ts">
interface Props {
  serviceName: string
  description: string[]
  logoUrl: string
}

const props = defineProps<Props>()
</script>
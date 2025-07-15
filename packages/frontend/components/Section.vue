<template>
  <div :style="{ backgroundColor: bg, color: fg }">
    <section class="max-w-6xl mx-auto px-5 pb-4">
      <slot />
    </section>
  </div>
</template>

<script setup lang="ts">
interface Props {
  bg?: string
  fg?: string
}

const props = defineProps<Props>()
</script>
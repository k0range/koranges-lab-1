<template>
  <div :class="[
    'box-content bg-white border border-[#E3E3E3] rounded-xl py-5 px-6',
    className
  ]">
    <h2 v-if="heading" class="text-2xl font-bold mb-2">
      {{ heading }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
  heading?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})
</script>
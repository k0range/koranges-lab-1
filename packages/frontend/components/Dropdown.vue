<template>
  <div class="relative inline-block" ref="dropdownRef">
    <div @click="toggleOpen">
      <slot name="trigger" />
    </div>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="open"
        :class="[
          'absolute mt-2 w-48 rounded-md shadow-lg bg-white border z-50',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  align?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right'
})

const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleOpen = () => {
  open.value = !open.value
}

// 外部クリックで閉じる
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
<template>
  <Popover class="relative">
    <PopoverButton>
      <slot name="trigger" />
    </PopoverButton>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute right-0 mt-2 z-10">
        <Container class="shadow-lg">
          <slot />
        </Container>
      </PopoverPanel>
    </Transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

interface Props {
  trigger?: any
}

const props = defineProps<Props>()
</script>
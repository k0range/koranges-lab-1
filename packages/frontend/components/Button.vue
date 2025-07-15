<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : type"
    @click="!to && emit('click')"
    :class="[
      'cursor-pointer text-[1.05rem] duration-200 hover:opacity-90',
      variant === 'primary' ? 'bg-[#2c2c2c] text-white' : 'bg-[#e3e3e3]',
      size === 'sm' ? 'py-1.5 text-[1rem] px-5' : 
      size === 'lg' ? 'py-2.5 px-6' : 
      'py-2 px-6',
      centered ? 'mx-auto block' : '',
      rounded === 'xl' ? 'rounded-xl' : 'rounded-full',
      className
    ]"
    :style="{
      color: fg,
      backgroundColor: bg
    }"
  >
    <component
      v-if="icon"
      :is="icon"
      :class="`inline mb-1 ${size === 'sm' ? 'h-4.5 mr-1.5' : 'h-4.5 mr-1 '}`"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { Component } from 'vue'

interface Props {
  className?: string
  variant?: 'primary' | 'secondary'
  rounded?: 'full' | 'xl'
  bg?: string,
  fg?: string,
  to?: string
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  centered?: boolean
  icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  variant: 'secondary',
  rounded: 'full',
  size: 'md',
  type: 'button',
  centered: false
})

const emit = defineEmits<{
  click: []
}>()
</script>

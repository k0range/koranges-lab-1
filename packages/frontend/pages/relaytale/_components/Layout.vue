<script setup lang="ts">
import ServiceLayout from '~/components/ServiceLayout.vue';

interface Props {
  noDescription?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  noDescription: false
})
</script>

<template>
  <ServiceLayout
    bg-color="#fffbe5"
    fg-color="#2C2C2C"
    service-name="Relaytale"
    :description="noDescription ? undefined : ['Relaytale is a site where everyone takes turns passing the baton and writing a story one sentence at a time.', 'As long as you follow the rules, you can write anything you like. So, what kind of story will unfold?']"
    logo="/collabtale.svg"
  >
    <slot></slot>
  </ServiceLayout>
</template>
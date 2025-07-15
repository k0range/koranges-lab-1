<template>
  <div class="grid grid-rows-[auto_1fr_auto] grid-cols-[100%] min-h-screen">
    <Navbar />
    <div 
      :style="{ backgroundColor: bgColor || '#f8f8f8', color: fgColor || '#484848' }"
    >
      <ServiceSection
        :service-name="serviceName"
        :description="description"
        :logo-url="logo"
      />
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
interface Props {
  bgColor?: string
  fgColor?: string
  serviceName: string
  description?: string[]
  logo: string
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: '#f8f8f8',
  fgColor: '#484848',
  serviceName: "",
  description: undefined,
  logo: ""
})
</script>
<template>
  <div class="sm:flex items-start mb-2 relative">
    <div :class="`flex items-center gap-2.5 flex-shrink-0 mr-3 opacity-90 mt-0.5 mb-2 sm:mb-0 ${protrude && '2xl:absolute 2xl:w-40 2xl:justify-end 2xl:right-full'}`">
      <img 
        v-if="user.image" 
        :src="user.image" 
        :alt="user.name" 
        class="w-6 h-6 rounded-full" 
      />
      <div v-else class="w-6 h-6" />
      
      <span 
        v-if="!omitUsername" 
        class="text-sm font-semibold text-nowrap 2xl:max-w-40 2xl:overflow-hidden"
      >
        {{ user.name }} is typing...
      </span>
    </div>
    
    <div class="flex-grow">
      <p class="text-lg"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  name: string
  image?: string
}

interface Props {
  user: User
  omitUsername?: boolean
  protrude?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  omitUsername: false
})
</script>
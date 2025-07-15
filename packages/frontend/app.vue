<template>
  <NuxtLoadingIndicator color="#484848" height="2" />
  <NuxtPage />
  <ClientOnly>
    <ProfileSetupModal v-if="showProfileSetupModal" />
  </ClientOnly>
</template>

<script setup>
import ProfileSetupModal from './components/ProfileSetupModal.vue';

const showProfileSetupModal = useShowProfileSetupModal()
</script>

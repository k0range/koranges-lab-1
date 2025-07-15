<template>
  <ins
    class="adsbygoogle"
    style="display: block"
    data-ad-client="ca-pub-3940256099942544"
    data-ad-slot="6300978111"
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    console.error(e)
  }
})
</script>
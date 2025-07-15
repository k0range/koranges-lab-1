<template>
  <div>
    <div class="flex gap-2 mt-4">
      <input type="text" class="border border-[#CFCFCF] rounded-xl text-lg py-1.5 px-4 flex-grow" placeholder="Type..." v-model="content">
      <Button variant="primary" rounded="xl" @click="handleSend">Write</Button>
    </div>
    <div class="flex"></div>
  </div>
</template>

<script setup>
const content = ref("")
const emit = defineEmits(['send'])

const handleSend = () => {
  if ( content.value.trim() !== "" ) {
    emit('send', content.value)
    content.value = "" // 入力をクリア
  }
}
</script>
<script setup lang="ts">
import api from '@/api'
import Layout from '../_components/Layout.vue'
import Container from '../_components/Container.vue'
import Paragraph from '../_components/Paragraph.vue'

import { MisskeyIcon, XIcon, LineIcon } from 'vue3-simple-icons'

const route = useRoute()

const beginning = ref("")
const paragraphs = ref([])

onMounted(async () => {
  const resp = await (await api.relaytale.get_tale.$get({
    query: {
      taleId: route.params.slug
    }
  })).json()

  beginning.value = resp?.beginning
  paragraphs.value = resp?.paragraphs

  if (resp?.finished === false) {
    location.href = "/relaytale"
  }
})
</script>

<template>
  <Layout bg-color="#fffbe5" fg-color="#2C2C2C" no-description>
    <Section>
      <h2 class="text-2xl font-bold mb-3">The story is complete!🎉</h2>
      <div class="gap-2 flex">
        <Button size="sm" :icon="XIcon" bg="#15202b" fg="#ffffff" @click="() => {
            openCenteredPopup(`http://x.com/share?url=https%3A%2F%2Fkoranges-lab.korange.work%2Frelaytale%2Ftale%2F${route.params.slug}`);
          }">Post on X</Button>
          <Button size="sm" :icon="MisskeyIcon" bg="#4ab300" fg="#fff" @click="() => {
            openCenteredPopup(`https://misskey-hub.net/share/?url=https:%2F%2Fkoranges-lab.korange.work%2Frelaytale%2Ftale%2F${route.params.slug}&visibility=public&localOnly=0`)
          }">Note on Misskey</Button>
      </div>
    </Section>
    <Section class="bg-white border-y-[#e3e3e3] border-y py-4">
      <Paragraph 
        :user="{ 
          name: 'Beginning'
        }" 
        :content="beginning"
        protrude 
      />
      <Paragraph 
        v-for="p in paragraphs"
        :user="{ 
          name: p.user.name, 
          image: p.user.image
        }" 
        :content="p.content"
        protrude 
      />
    </Section>
  </Layout>
</template>

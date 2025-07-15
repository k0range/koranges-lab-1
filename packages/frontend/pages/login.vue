<template>
  <div class="grid grid-rows-[auto_1fr_auto] grid-cols-[100%] min-h-screen">
    <Navbar noLogo />
    <div 
      :style="{ backgroundColor: '#ffffff', color: '#484848' }"
    >
      <Section class="-translate-y-4">
        <NuxtLink to="/"><img
          src="/logo.svg"
          alt="オレンジラボ"
          class="h-9 mb-4.5"
        /></NuxtLink>
        <div class="">
          <!--オレンジラボはお使いのアカウントですぐに使えます✨️-->
          <Container heading="Login!">
            <Login></Login>
          </Container>
        </div>
      </Section>
    </div>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Container from './relaytale/_components/Container.vue'
import { Pencil as PencilIcon, Eye as EyeIcon } from 'lucide-vue-next'

// ページタイトルの設定
useHead({
  title: 'Collabtale - みんなで物語を作ろう'
})

// 認証状態の管理（後で実装）
const user = ref(null)

// tRPCの代替（後で実装）
const hello = ref({ greeting: 'Hello from Collabtale!' })

// ルールのデータ
const rules = [
  '公序良俗に反する内容はNGです🙅',
  '（チャット欄などで）書いている人を急かすのはできるだけやめてください。',
  '他の人が書いた内容を過度に批判するのはやめてください。',
  'もしも不適切な内容があれば、管理者の独断で削除することもあります。'
]

// データの取得（後で実装）
onMounted(async () => {
  try {
    // TODO: tRPCまたはAPIからデータを取得
    // const response = await $fetch('/api/relaytale/tale/hello', {
    //   method: 'POST',
    //   body: { text: 'from tRPC' }
    // })
    // hello.value = response
    
    // TODO: 認証状態を確認
    // user.value = await getCurrentUser()
  } catch (error) {
    console.error('データの取得に失敗しました:', error)
  }
})

</script>
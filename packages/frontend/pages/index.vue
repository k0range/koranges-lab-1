<template>
  <div class="grid grid-rows-[auto_1fr_auto] grid-cols-[100%] min-h-screen">
    <Navbar noLogo />
    <div 
      :style="{ backgroundColor: '#ffffff', color: '#484848' }"
    >
      <Section class="-translate-y-4">
        <img
          src="/logo.svg"
          alt="オレンジラボ"
          class="h-14 mb-4.5"
        />
        <!--<h2 class="text-xl mb-8">オレンジラボは、Korange が作成した<br />「日常をちょっと面白くする」小さなウェブサービスのコレクションです。</h2>-->
        <h2 class="text-xl mb-8">Korange's Lab is a collection of small web services created by Korange<br>that "make everyday life a little more interesting."</h2>

        <NuxtLink to="/relaytale" class="border border-[#E3E3E3] w-full min-h-32 rounded-xl flex overflow-hidden text-left">
          <div class="w-24 sm:w-40 min-h-33 h-full border-r p-0.5 border-r-[#e3e3e3] bg-[#fffbe5] flex flex-col justify-center">
            <img src="../assets/relaytale_image.png" alt="" class="">
          </div>
          <div class="ml-6 my-5.5">
            <img src="../assets/collabtale.svg" class="h-14 inline mb-1" alt="">
            <p class="text-lg">Collabration Story Writing</p>
            <!--<p class="text-lg">みんなで続きを書く物語</p>-->
          </div>
        </NuxtLink>

        <!--<div class="p-4 border-dashed border-8 border-[#ff00ff] bg-gradient-to-r from-[#0000ff] via-[#ff0000] to-[#00ffff] mt-16" style="font-family: 'MS Gothic';">
  <marquee behavior="alternate" scrollamount="20" class="bg-black border-4 border-double border-yellow-300 p-2">
    <h1 class="text-5xl font-extrabold text-[#00ff00]">>>>>>>WHAT THE HELL IS THIS SHITTY CODE!?!?!?!??!?!<<<<</h1>
  </marquee>
  <p class="text-[#ffff00] text-xl font-bold bg-black p-2 mt-4">
    This site — <img src="/logo.svg" class="inline h-8"> — was thrown together at 
    <img src="/wtf/breakneck.gif" class="inline h-8"> 
    <span class="text-3xl rainbow-text">SPEED</span> for a YSWS <img src="/wtf/deadline.gif" class="inline h-10 animate-bounce">. 
    So yeah, things might be <span class="text-4xl">broken</span>, <span class="text-4xl">missing</span>, or just plain 
    <img src="/wtf/werid.png" class="inline h-12 w-22 animate-wiggle">.
  </p>
  <p class="text-[#ffff00] text-2xl font-bold italic mt-4">
    Refactoring, rewiring, and rethinking are all in progress.<br/>
    <span class="text-red-500 bg-white px-2 animate-pulse">Sit tight, it’ll get better. Probably.</span>
  </p>
  <p class="text-[#ff00ff] text-2xl font-extrabold mt-6 animate-bounce bg-black p-2 border border-dotted border-white">
    >>> If you need something rn, hit me up: <u>hi (atmark) korange.work</u> <<<
  </p>
</div>-->
      </Section>
    </div>
    <Footer />
  </div>
</template>
<script setup lang="ts">
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

<style>
@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
/* 虹色テキスト */
.rainbow-text {
  background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 400% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbowMove 2s linear infinite;
}
@keyframes rainbowMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
</style>
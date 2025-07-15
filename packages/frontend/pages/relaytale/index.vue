<template>
  <Layout bg-color="#fffbe5" fg-color="#2C2C2C">
    <Section>
      <div class="md:flex gap-4">
        <div class="flex-grow">          
          <Container class-name="mb-4">
            <!--<Paragraph 
              :user="{ name: '書き出し' }" 
              content="ある朝目を覚ますと、僕の部屋の冷蔵庫が魔王を名乗っていた。" 
              omit-username 
            />
            <Paragraph 
              :user="{ 
                name: 'これんじdayo', 
                image: 'https://lh3.googleusercontent.com/a/ACg8ocJ-v87uDzhifYSgQai31rB7VnEoCPN-7zc_QOWRXsof_kyZMBQ=s96-c' 
              }" 
              content="「我は漆黒の支配者、冷気の帝王、氷点下の王――名をマオウ・ザ・フリーザーという！」" 
              omit-username 
            /> 

            <hr class="my-5 border-[#e3e3e3]">-->
            
            <div v-if="user !== null">
              <!--<div class="flex justify-center gap-2.5 items-center mb-3.5">
                <div>
                  <div class="absolute bg-green-400 w-2 h-2 rounded-full"></div>
                  <div class="bg-green-400 w-2 h-2 rounded-full animate-ping opacity-80 -scale-110"></div>
                </div>
                <div class="text-sm font-bold opacity-70">現在、８人が参加中</div>
              </div>-->
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <Button @click="enterGame" variant="primary" size="lg" :icon="PencilIcon">Join writing</Button>
                <!--<Button variant="secondary" size="lg" :icon="EyeIcon">観戦する</Button>-->
              </div>
            </div>
            
            <div v-else>
              <h2 class="text-2xl font-bold mb-2">You can start using Relaytale right away with your account!✨️</h2>
              <Login />
            </div>
          </Container>

          <!--<Container heading="遊び方">
            <Dropdown align="left">
              <template #trigger>
                <Button variant="primary" size="lg" :icon="PencilIcon" class-name="w-full">
                  参加する
                </Button>
              </template>
              
              <ul class="list-disc pl-5">
                <li>
                  <NuxtLink to="/collabtale/create" class="text-blue-500 hover:underline">
                    物語を作る
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/collabtale/join" class="text-blue-500 hover:underline">
                    物語に参加する
                  </NuxtLink>
                </li>
              </ul>
            </Dropdown>
          </Container>-->
        </div>
        
        <div>
          <!--<Container class-name="md:w-[300px]" heading="ルール">
            <p>みんなが快適に楽しめるよう、運営者からのお願いです🙏</p>
            <ol class="space-y-2 mt-4">
              <li 
                v-for="(text, idx) in rules" 
                :key="idx" 
                class="flex items-start gap-3.5"
              >
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-full bg-[#2C2C2C] text-white font-bold text-sm"
                  style="min-width: 1.75rem"
                >
                  {{ idx + 1 }}
                </span>
                <span>{{ text }}</span>
              </li>
            </ol>
          </Container>-->
          
          <!--
          <Container class-name="w-[300px] mt-4" heading="サイトが気に入ったら...">
                      <div class="w-[300px] h-[250px] bg-green-500">AD</div>

          </Container>-->
          
          <!-- コメントアウト部分
          <Container>
            <div class="w-[300px] h-[250px] bg-green-500">AD</div>
            a
            <AdUnit/>
          </Container>
          -->
        </div>
      </div>
    </Section>
  </Layout>
</template>

<script setup lang="ts">
import Layout from './_components/Layout.vue'
import Container from './_components/Container.vue'
import Paragraph from './_components/Paragraph.vue'

import { Pencil as PencilIcon, Eye as EyeIcon } from 'lucide-vue-next'

// ページタイトルの設定
useHead({
  title: 'Relaytale - Let\'s all create a chaos story'
})

const router = useRouter()

function enterGame() {
  sessionStorage.setItem('enteredFromLobby', 'true')
  router.push('/relaytale/app')
}

// 認証状態の管理（後で実装）
const { getUser } = useSession()
const user = await getUser()

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
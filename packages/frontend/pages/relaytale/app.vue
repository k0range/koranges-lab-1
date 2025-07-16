<template>
  <ClientOnly>
  <Layout bg-color="#fffbe5" fg-color="#2C2C2C" no-description>
    <Section>
      <h2 class="text-2xl font-bold mb-0.5">
        {{ status === 'writing' ? 'Someone is writing...' : null }}
        {{ status === 'your_turn' ? "It's your turn!" : null }}
        {{ status === 'loading' ? 'Loading...' : null }}
        {{ status === 'closed' ? 'Disconnected' : null }}
        {{ status === 'alone_writed' ? 'Nobody is here 🥲' : null }}
      </h2>
      <div v-if="status === 'alone_writed'">
        <p class="mt-2.5 text-lg">
          It looks like you're the only one playing right now.<br>
          Try joining again later, or <strong>invite your friends to join you.</strong>
        </p>
        <div class="flex gap-2 my-2.5">
          <Button size="sm" :icon="XIcon" bg="#15202b" fg="#ffffff" @click="() => {
            openCenteredPopup('http://x.com/share?url=https%3A%2F%2Fkoranges-lab.korange.work%2Frelaytale%2Fapp&text=Nobody%20is%20here%2C%20join%20me!%0D%0A%0D%0ARelaytale%204111%20-%20A%20free%20and%20chaotic%20relay%20story');
          }">Post on X</Button>
          <Button size="sm" :icon="MisskeyIcon" bg="#4ab300" fg="#fff" @click="() => {
            openCenteredPopup('https://misskey-hub.net/share/?text=Come%20write%20with%20me!%0A%0ARelaytale%20-%20A%20free%20and%20chaotic%20relay%20story&url=https:%2F%2Fkoranges-lab.korange.work%2Frelaytale%2Fapp&visibility=public&localOnly=0')
          }">Note on Misskey</Button>
          <Button size="sm" :icon="LineIcon" bg="#06c655" fg="#fff" @click="() => {
            openCenteredPopup('https://social-plugins.line.me/lineit/share?url=https:%2F%2Fkoranges-lab.korange.work%2Frelaytale%2Fapp&text=text=Relaytale%20-%20A%20free%20and%20chaotic%20relay%20story')
          }">Share via LINE</Button>
        </div>
      </div>
    </Section>
    <Section v-if="status !== 'closed' && status !== 'loading'" class="bg-white border-y-[#e3e3e3] border-y py-4">
      <Paragraph 
        :user="{ 
          name: 'Beginning'
        }" 
        :content="roomState.beginning"
        protrude 
      />
      <Paragraph 
        v-for="p in roomState.paragraphs"
        :user="{ 
          name: p.user.name, 
          image: p.user.image
        }" 
        :content="p.content"
        protrude 
      />
      <div v-if="status === 'your_turn'">
        <PostForm @send="send" />
      </div>
      <div v-if="status === 'writing'">
        <Typing
          :user="{ 
            name: (roomState.users.find((a) => a.id === roomState.batonHolderId)).name, 
            image: (roomState.users.find((a) => a.id === roomState.batonHolderId)).image
          }"
        />
      </div>
      <div v-if="status !== 'closed' && status !== 'loading' && status !== 'alone_writed'" class="flex gap-3">
        <button class="text-sm opacity-50 hover:opacity-80 duration-200 mt-1 flex items-center cursor-pointer" v-if="status === 'your_turn'"  @click="pass"><SkipForward class="h-4" />Pass</button>
        <div class="text-sm opacity-50 mt-1 flex items-center" v-if="timer"><Timer class="h-4" />{{ timer }} seconds left</div>
        <div class="text-sm mt-1 flex items-center opacity-50" :class="{'opacity-100 text-yellow-500' : 8 > roomState.paragraphsRemains, 'opacity-100 text-red-500 font-bold' : roomState.paragraphsRemains === 1}"><Scroll class="h-4" />
          <span v-if="roomState.paragraphsRemains === 1">This paragraph is the end of the story!</span>
          <span v-else>{{roomState.paragraphsRemains}} paragraphs remaining</span>
        </div>
      </div>
    </Section>
    <Section v-if="status !== 'closed' && status !== 'loading'">
      <div class="md:flex items-stretch gap-4 mt-8">
        <div class="flex-grow w-1/2">          
          <Container heading="Messages" class-name="mb-4">
            <!--<Paragraph 
              :user="{ 
                name: 'これんじdayo', 
                image: 'https://lh3.googleusercontent.com/a/ACg8ocJ-v87uDzhifYSgQai31rB7VnEoCPN-7zc_QOWRXsof_kyZMBQ=s96-c' 
              }" 
              content="aa"
            />-->
            <ul>
              <li v-for="i in roomState.chat">{{ i }}</li>
            </ul>
          </Container>
        </div>
        <div class="flex-grow w-1/2">          
          <Container heading="Participants" class-name="mb-4">
            <div v-for="u of roomState.users" :class="`inline-flex items-center gap-2.5 flex-shrink-0 mr-5 mt-0.5 mb-2 sm:mb-0`">
              <img 
                v-if="u.image" 
                :src="u.image" 
                :alt="u.name" 
                class="w-6 h-6 rounded-full"
                :class="{'outline-4 outline-[#e9ca1c]': u.batonHolder}" 
              />
              <div v-else class="w-6 h-6" />

              <span class="text-sm font-semibold text-nowrap">
                {{ u.name }}
              </span>
            </div>
            <!--<div class="bg-[#f6f6f6] rounded-xl text-center p-4 mt-2">
              <div>ここにはあなたしかいないようです。</div>
              <div class="mb-3">友だちを誘って、にぎやかにしよう！</div>
              <div class="flex gap-2 justify-center">
                <Button size="sm" :icon="XIcon" bg="#15202b" fg="#ffffff">シェア</Button>
                <Button size="sm" :icon="MisskeyIcon" bg="#4ab300" fg="#fff">シェア</Button>
                <Button size="sm" :icon="LineIcon" bg="#06c655" fg="#fff">シェア</Button>
              </div>
            </div>-->
          </Container>
        </div>
      </div>
    </Section>
  </Layout>
  </ClientOnly>
</template>

<script setup lang="ts">
import Layout from './_components/Layout.vue'
import Paragraph from './_components/Paragraph.vue'
import Container from './_components/Container.vue'
import PostForm from './_components/PostForm.vue'
import Typing from './_components/Typing.vue'
import Button from '~/components/Button.vue'

const { $api } = useNuxtApp()
const api = $api // 互換

import { GoogleIcon, LineIcon, MisskeyIcon, XIcon } from 'vue3-simple-icons'
import { Timer, Scroll, SkipForward } from 'lucide-vue-next'

const playSound = () => {
  const audio = new Audio('/relaytale/mixkit-software-interface-remove-2576.wav')
  audio.volume = 0.5
  audio.play().catch((err) => {
    console.error('音声の再生に失敗しました:', err)
  })
}

// ページタイトルの設定
useHead({
  title: 'Relaytale'
})

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const status = useState(() => "loading")
const connection = useState<WebSocket | null>(() => null)

// 認証状態の管理（後で実装）
const { getUser } = useSession()

const user = await getUser()

type RoomState = {
  value: { // サーバー側のRoomStateとは別のもの
    
    // 他に複雑な状態、例: チャット履歴、ゲーム進行状況、投票結果など
  }
}

const roomState = useState(() => { return {
  users: [],
  batonHolderId: null,
  userOrder: [],
  chat: [],
  paragraphs: null,
  paragraphsRemains: null
} })

const timer = ref(null)

function send(content: string) {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
  connection.value?.send(JSON.stringify({
    type: "write_paragraph",
    content
  }))
}
function pass() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
  connection.value?.send(JSON.stringify({
    type: "pass"
  }))
}

useLeaveGuard(
  'このページを離れると退出されます。本当によろしいですか？',
  () => {
    connection.value?.close()
  }
)

// データの取得（後で実装）
onMounted(async () => {
  setInterval(() => {
    if ( timer.value ) {
      timer.value = timer.value - 1
      if ( timer.value === 0 ) {
        timer.value = null
      }
    }
  }, 1000);

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload()
    }
  })

  //status.value = "ルームを検索してい"
  console.log(api.relaytale.join.$url().toJSON())

  const taleId = await (await api.relaytale.join.$post({
    json: {
      lang: 'en'
    }
  })).json()

  //status.value = "ルームの情報を取得してい"
  const tale = await (await api.relaytale.get_tale.$get({
    query: {
      taleId: taleId.taleId
    }
  })).json()
  roomState.value.paragraphs = tale?.paragraphs
  roomState.value.beginning = tale?.beginning
  
  //status.value = "接続を準備してい"
  const wsToken = await (await api.relaytale.get_websocket_token.$get()).json()

  //status.value = "接続してい"
  connection.value = new WebSocket(`${apiUrl}relaytale/ws?token=${wsToken.token}&taleId=${taleId.taleId}`);

  connection.value.onopen = function(event) {
    status.value = "loading"
  }
  connection.value.onclose = function(event) {
    status.value = "closed"
  }
  connection.value.onmessage = function(event) {
    const message = JSON.parse(event.data) // as
    console.log(message)
    
    if ( message.type === "roomstate" ) {
      roomState.value.users = message.users
      roomState.value.chat = message.chat
      roomState.value.batonHolderId = message.batonHolderId
      roomState.value.paragraphsRemains = message.paragraphsRemains
    }
    if ( message.type === "baton_change" ) {
      roomState.value.users.forEach(item => {
        if ( message.content.newBatonHolderId === item.id ) {
          item.batonHolder = true;
        } else {
          item.batonHolder = false;
        }
      });
      if ( message.content.duration ) {
        timer.value = message.content.duration
      }
    }
    if ( message.type === 'alone_writed' ) {
      status.value = "alone_writed"
    }
    if ( message.type === 'new_paragraph' ) {
      roomState.value.paragraphs.push(message.content)
      roomState.value.paragraphsRemains = message.paragraphsRemains
    }
    if ( message.type === 'error' ) {
      roomState.value.chat.push(message.content)
    }
    if ( message.type === 'finish' ) {
      location.href = `/tale/${message.id}`
    }

    if ( message.type === 'roomstate' || message.type === 'baton_change' ) {
      if ( (roomState.value.users.find((item) => item.id === user.id)).batonHolder ) {
        if ( status.value !== 'your_turn' ) {
          status.value = 'your_turn'
          playSound()
        }
      } else {
        status.value = 'writing'
      }
    }
  };
})
</script>
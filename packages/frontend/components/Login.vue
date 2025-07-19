<template>
  <div>
    <!--<p>
      続けると、オレンジラボのアカウントでログインまたは登録され、<br/>
      利用規約およびプライバシーポリシーに同意したものとみなされます。
    </p>-->
    <p>
      By continuing, you will be deemed to have logged in or registered with an Korange's Lab account.
    </p>
    
    <div class="flex mt-4 gap-3">
      <!--<button
        class="w-full rounded-full p-2.5 bg-[#000000] text-white text-[1.05rem] cursor-pointer duration-200 hover:opacity-90"
        @click="signInWithTwitter"
      >
        <component :is="XIcon" class="inline h-4.5 mr-2.5 mb-0.5" />
        X で続ける
      </button>-->
      
      <form v-if="authCsrfToken !== null && callbackUrl !== null" class="w-full" action="https://koranges-lab-api.korange.work/api/auth/signin/google" method="post">
        <input type="hidden" name="csrfToken" :value="authCsrfToken">
        <input type="hidden" name="callbackUrl" :value="callbackUrl">
        <button
          class="w-full rounded-full p-2.5 bg-[#4285F4] text-white text-[1.05rem] cursor-pointer duration-200 hover:opacity-90"
          type="submit"
        >
          <component :is="GoogleIcon" class="inline h-4.5 mr-2.5 mb-0.5" />
          Continue with Google
        </button>
      </form>
      <form v-if="authCsrfToken !== null && callbackUrl !== null" class="w-full" action="https://koranges-lab-api.korange.work/api/auth/signin/slack" method="post">
        <input type="hidden" name="csrfToken" :value="authCsrfToken">
        <input type="hidden" name="callbackUrl" :value="callbackUrl">
        <button
          class="w-full rounded-full p-2.5 bg-[#ec3750] text-white text-[1.05rem] cursor-pointer duration-200 hover:opacity-90"
          type="submit"
        >
          <component :is="SlackIcon" class="inline h-4.5 mr-2.5 mb-0.5" />
          Continue with HackClub Slack
        </button>
        <div class="text-center text-xs mt-1.5 opacity-50">This is maybe a temporary option. Please remember the email address of your Slack account.</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// アイコンのインポート (実際の実装では適切なアイコンライブラリを使用)
import { GoogleIcon, XIcon, SlackIcon } from 'vue3-simple-icons'

const config = useRuntimeConfig()

const authCsrfToken = ref(null)
const callbackUrl = ref(null)

onMounted(() => {
  const url = new URL(window.location.href)
  url.searchParams.set('authenticated', 'true')
  callbackUrl.value = url.toString()
})

const csrfResp = await (await fetch(`${config.public.apiUrl}api/auth/csrf`, {
  method: "GET",
  credentials: "include"
})).json()
authCsrfToken.value = csrfResp.csrfToken

</script>
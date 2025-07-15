<template>
  <div class="z-50 fixed left-0 top-0 w-screen h-screen bg-[#00000060] flex flex-col justify-center">
    <Container class-name="mx-auto w-[38rem] py-6" heading="👋 Welcome, Let's setting up your profile!">
      <p class="mb-6">This information will be showed to other users.</p>
      <div class="flex">
        <div>
          <img :src="user.image" class="h-12 rounded-full mr-5">
        </div>
        <div class="flex-grow">
          <div class="mb-5">
            <label for="name" class="text-sm font-bold opacity-50 mb-0.5 block">Name</label>
            <input id="name" type="text" class="block border border-[#CFCFCF] rounded-xl py-1.5 px-3" placeholder="Korange" v-model="name" >  
          </div>
          <!--<div class="mb-5">
            <SwitchGroup>
              <Switch
                id="hideImage"
                v-model="hideImage"
                :class="hideImage ? 'bg-[#2c2c2c]' : 'bg-[#8e8e8e]'"
                class="relative inline-flex h-5.5 w-10 items-center rounded-full cursor-pointer"
              >
                <span
                  :class="hideImage ? 'translate-x-5.5' : 'translate-x-1'"
                  class="inline-block h-3.5 w-3.5 transform rounded-full transition bg-white"
                />
              </Switch>
              <SwitchLabel class="inline-flex flex-col justify-center ml-2.5 -translate-y-0.25">プロフィール画像を隠す</SwitchLabel>
            </SwitchGroup>
            <div class="text-xs mt-2 opacity-50">* プロフィール画像をアップロードする機能は近日実装予定です。</div>
          </div>-->
        </div>
      </div>
      <Button variant="primary" class-name="mt-4" @click="() => {submitForm()}">Continue</Button>
    </Container>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp()
const api = $api // 互換

import Button from './Button.vue'
import Container from '../pages/relaytale/_components/Container.vue'

import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue'

const { getUser, refreshSession } = useSession()
const user = await getUser()

const name = ref("")
const hideImage = ref(false)

name.value = user.name

async function submitForm(){
  await api.set_profile.$post({
    json: {
      name: name.value,
      //hideImage: hideImage
    }
  })
  await refreshSession()
  useShowProfileSetupModal().value = false
}
</script>
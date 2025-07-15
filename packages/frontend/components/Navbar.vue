<template>
  <nav :class="[
    'max-w-6xl w-full mx-auto px-5 flex items-center justify-between text-[#484848]',
    tiny ? 'py-1.5' : 'py-3.5'
  ]">
    <div class="flex">
      <NuxtLink to="/">
        <img src="/logo.svg" alt="Korange's Lab" :class="`${tiny ? 'h-6' : 'h-8'} ${noLogo && 'hidden'}`" />
      </NuxtLink> 
      <div v-if="noLogo" :class="`${tiny ? 'h-6' : 'h-8'} w-1`"></div>
    </div>
    
    <div 
      class="transition-opacity duration-500"
      :class="showNav ? 'opacity-100' : 'opacity-0'"
    >
      <ul :class="tiny ? 'text-xs' : 'text-sm'">
        <li class="hidden sm:inline-block mr-3">
          <NuxtLink to="/" class="text-[#484848] py-3 px-2 hover:opacity-90 duration-100">
            Home
          </NuxtLink>
        </li>
        <li class="hidden sm:inline-block mr-3">
          <NuxtLink to="https://korange.work/" class="text-[#484848] py-3 px-2 hover:opacity-90 duration-100">
            About admin
          </NuxtLink>
        </li>
        
        <!-- 認証状態に応じて表示を切り替え -->
        <template v-if="user">
          <Popover class="inline">
            <template #trigger>
              <button class="inline-block cursor-pointer hover:opacity-90 duration-100">
                <img 
                  :src="user.image || ''" 
                  :class="['inline rounded-full mr-2', tiny ? 'h-5 w-5' : 'h-7 w-7']" 
                  :alt="user.name"
                />
                <div class="inline text-[#484848]">{{ user.name }}</div>
              </button>
            </template>
            <ul>
              <li>
                <button @click="logout" class="text-[#484848] hover:text-blue-500">
                  Logout
                </button>
              </li>
            </ul>
          </Popover>
        </template>
        
        <template v-else>
          <li class="inline-block">
            <NuxtLink 
              to="/login" 
              :class="[
                'text-white bg-[#484848] font-bold rounded-full',
                tiny ? 'py-1.25 px-3.5' : 'py-2 px-4.5'
              ]"
            >
              Login
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  tiny?: boolean
  noLogo?: boolean
}

interface User {
  name: string
  image?: string
  email?: string
}

const props = withDefaults(defineProps<Props>(), {
  tiny: false
})

// 認証状態の管理 (後で実装)
const { getUser } = useSession();
const showNav = ref(false)

const user = await getUser()

// ログアウト処理 (後で実装)
const logout = () => {
  // TODO: 認証プロバイダーのログアウト処理を実装
  location.href = "https://koranges-lab-api.korange.work/api/auth/signout"
}

onMounted(async () => {
  showNav.value = true // ← その後に表示
})
</script>
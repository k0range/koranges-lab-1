// plugins/api.ts
import { hc } from 'hono/client'
import type { AppType } from 'backend/src'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const api = hc<AppType>(config.public.apiUrl, {
    init: {
      credentials: "include"
    }
  })

  return {
    provide: {
      api
    }
  }
})

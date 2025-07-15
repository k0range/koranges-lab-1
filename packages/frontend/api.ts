import type { AppType } from 'backend/src'
import { hc } from 'hono/client'

const client = hc<AppType>(String(process.env.NUXT_PUBLIC_API_URL?.trim()), {
  init: {
    credentials: "include"
  }
})

export default client
export type { AppType }
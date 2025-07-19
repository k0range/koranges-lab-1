import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import Slack from '@auth/core/providers/slack'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import RelaytaleRoutes, { injectWebSocket } from './relaytale/routes'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3000', 'https://koranges-lab.korange.work'],
  credentials: true
}))

const routes = app
  .use(
    '*',
    initAuthConfig((c) => ({
      secret: c.env.AUTH_SECRET,
      providers: [
        Google,
        Slack
      ],
      callbacks: {
        async redirect({ url, baseUrl }) {
          return url
        }
      },
      //events: {
      //  async signIn({ user, account, isNewUser }) {
      //    if (isNewUser) {
      //      console.log("🎉 新規ユーザーが作成されました:", user)
      //    } else {
      //      console.log("👋 既存ユーザーがログインしました:", user)
      //    }
      //  }
      //},
      adapter: PrismaAdapter(prisma)
    }))
  )
  .use('/api/auth/*', authHandler())
  .use('*', verifyAuth())
  .route("/relaytale", RelaytaleRoutes)
  .get('/', (c) => {
    const auth = c.get('authUser')

    return c.text(`Hello, ${auth.session.user?.name}`)
  })
  .post('/set_profile',
    zValidator(
      'json',
      z.object({
        name: z.string().optional(),
        hideImage: z.boolean().optional()
      })
    ),
    async (c) => {
      const auth = c.get('authUser')
      if ( !auth.user ) {
        c.status(401)
        return c.body("Unauthorized")
      }

      const req = c.req.valid('json')
      
      await prisma.user.update({
        where: {
          id: auth.user.id
        },
        data: {
          explicitlySetProfile: true,
          name: req.name
        }
      })

      return c.json({ "success": true })
    }
  )
  .get('/me', async (c) => {
    const auth = c.get('authUser')
    if ( !auth.user ) {
      c.status(401)
      return c.body("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.user.id
      }
    })
    if ( !user ) {
      c.status(401)
      return c.body("Unauthorized")
    }

    c.status(200)
    return c.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      explicitlySetProfile: user.explicitlySetProfile
    })
  })

export type AppType = typeof routes

const server = serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3001)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

injectWebSocket(server)
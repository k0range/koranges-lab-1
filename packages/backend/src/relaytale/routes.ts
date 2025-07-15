import { Hono } from 'hono'
import { createNodeWebSocket } from '@hono/node-ws'
import { prisma } from '../prisma'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import type { User } from '@prisma/client'
import websocketRoute, { injectWebSocket } from './websocket/route'

import jsonwebtoken from 'jsonwebtoken'
import beginnings from './beginnings'

type RoomState = {
  users: Map<WebSocket, { user: User }>, // key: userId
  batonHolderId: string | null,  // バトン保持者のユーザーID
  userOrder: string[], // バトンを回す順番（userIdの配列）
  chat: string[]
  // 他に複雑な状態、例: チャット履歴、ゲーム進行状況、投票結果など
}
const rooms = new Map<string, RoomState>() // Key: taleId

const app = new Hono()
  .get(
    '/get_websocket_token',
    (c) => {
      const auth = c.get('authUser')
      const jwt = jsonwebtoken.sign({
        user: auth.user?.id,
        exp: Math.floor(Date.now() / 1000) + 60
      }, process.env.JWT_SECRET || "")

      return c.json({
        token: jwt
      })
    }
  )
  .post(
    '/join',
    zValidator(
      'json',
      z.object({
        lang: z.enum(['ja', 'en'])
      })
    ),
    async (c) => {
      const auth = c.get('authUser')
      const req = c.req.valid('json')
      
      let type = "found"
      let tale = await prisma.tale.findFirst({
        select: {
          id: true
        },
        where: {
          finished: false,
          lang: req.lang
        }
      })
      if ( !tale ) {
        const beginningList = beginnings[req.lang]
        type = "created"
        tale = await prisma.tale.create({
          data: {
            finished: false,
            lang: req.lang,
            beginning: beginningList[Math.floor(Math.random() * beginningList.length)]
          }
        })
      }
      
      return c.json({
        taleId: tale.id,
        type: type
      })
    }
  )
  .get(
    "/get_tale",
    zValidator(
      'query',
      z.object({
        taleId: z.string()
      })
    ),
    async (c) => {
      const { taleId } = c.req.valid('query')

      const tale = await prisma.tale.findUnique({
        where: {
          id: taleId
        },
        include: {
          paragraphs: {
            include: {
              user: {
                select: {
                  image: true,
                  name: true
                }
              }
            }
          },
        }
      })
      return c.json(tale)
    }
  )
  .route("/ws", websocketRoute)
  .get("/", (c) => {
    return c.text(`Hello`)
  })

export { injectWebSocket }
export default app

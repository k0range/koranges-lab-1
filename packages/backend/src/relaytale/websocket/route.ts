import { Hono } from 'hono'
import { createNodeWebSocket } from '@hono/node-ws'
import { prisma } from '../../prisma'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import type { User, Tale } from '@prisma/client'

import jsonwebtoken from 'jsonwebtoken'

type RoomState = {
  users: Map<string, { user: User, ws: WebSocket }>, // key: userId
  batonHolderId: string | null,  // バトン保持者のユーザーID
  userOrder: string[], // バトンを回す順番（userIdの配列）
  chat: string[],
  batonTimeoutId?: NodeJS.Timeout,
  lastParagraphId?: string,
  paragraphCount: number,
  maxParagraphs: number
  // 他に複雑な状態、例: チャット履歴、ゲーム進行状況、投票結果など
}
const rooms = new Map<string, RoomState>() // Key: taleId


const app = new Hono()
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

function rotateBatonAndBroadcast(room: RoomState, tale, currentIndex?: number): string | null 
{
  console.log(`-> Rotate baton and broadcast...`)

  if (room.batonTimeoutId) {
    clearTimeout(room.batonTimeoutId);
  }

  let nextIndex: number

  if ( room.batonHolderId === null ) {
    console.log(`-> バトンを持っている人はいないので、0番目の人を選びます`)
    nextIndex = 0
  } else {
    if (currentIndex === undefined) {
      currentIndex = room.userOrder.indexOf(room.batonHolderId!);
    }

    console.log("-> Current index: " + currentIndex)
    console.log("-> room.userOrder.length: " + room.userOrder.length)
    if (currentIndex === -1 || room.userOrder.length === 0) return null;

    nextIndex = (currentIndex + 1) % room.userOrder.length;

    console.log(`-> さっきのバトン持ってる人は${currentIndex}番目なので、次の${nextIndex}番目の人にします`)
  }

  let nextUserId: string | null = room.userOrder[nextIndex];
  room.batonHolderId = nextUserId;

  console.log(`-> ${nextIndex}番目の人は、ID ${nextUserId} さんです!`)
  console.log(`-> 最後の段落を書いたのは ${room.lastParagraphId}、ここで選ばれた人は ${nextUserId} ...`)

  // 最後の段落を書いた人と、次にバトンを取る人が同じ人なら...
  //let lastParagraphId = tale?.paragraphs[tale?.paragraphs.length - 1].userId
  if ( nextUserId === room.lastParagraphId ) {
    console.log(`-> あー、最後の段落を書いた人と被ったようです。`)
    // room.userOrderの中で最後の段落のID以外のユーザーがいるかチェック
    const otherUsersExist = room.userOrder.some(id => id !== room.lastParagraphId);

    if (otherUsersExist) {
      console.log(`-> その次にも人がいたので、更に次に回します`)
      // さらに次へ
      nextIndex = (nextIndex + 1) % room.userOrder.length;
      nextUserId = room.userOrder[nextIndex];
      room.batonHolderId = nextUserId;
      console.log(`-> 改めまして、次の人は${nextIndex}番目のID ${nextUserId} さんです。`)

      const chatMsg = JSON.stringify({
        type: 'error',
        content: `It's ${room.users.get(nextUserId)?.user.name}'s turn! (The person who wrote the last paragraph will be skipped)`
      });
      for (const client of room.users.values()) {
        client.ws.send(chatMsg);
      }
    } else {
      console.log(`-> あーけど、その人しかいません。一旦バトンはnullにして、招待するように誘いましょう。`)
      // 最後の段落の人しかいない場合は、一時的にバトンを持っている人をnullにして、ユーザーに告知
      nextUserId = null
      room.batonHolderId = null
      const batonMsg = JSON.stringify({
        type: 'alone_writed'
      });
      for (const client of room.users.values()) {
        client.ws.send(batonMsg);
      }
      // 例えばreturn nullにして終了するなど
      return null;
    }
  } else {
    const chatMsg = JSON.stringify({
      type: 'error',
      content: `It's ${room.users.get(nextUserId)?.user.name}'s turn!`
    });
    for (const client of room.users.values()) {
      client.ws.send(chatMsg);
    }
  }

  if (nextUserId !== null) {
    // 3分経過したら...
    room.batonTimeoutId = setTimeout(() => {
      console.log(`Baton timeout for user ${nextUserId}, skipping...`);
      const chatMsg = JSON.stringify({
        type: 'error',
        content: `Skipping ${room.users.get(nextUserId)?.user.name} (Time out)`
      });
      for (const client of room.users.values()) {
        client.ws.send(chatMsg);
      }
      rotateBatonAndBroadcast(room, tale);
    }, 3 * 60 * 1000); // 3分
  }

  const batonMsg = JSON.stringify({
    type: 'baton_change',
    content: {
      newBatonHolderId: nextUserId,
      duration: 3 * 60
    }
  });

  for (const client of room.users.values()) {
    client.ws.send(batonMsg);
  }

  return nextUserId;
}

function broadcastAll(room: RoomState, content: {}) {}

function createRoomstateForClient(room: RoomState) {
  let users = []

  for (const userId of room.userOrder) {
    const roomUser = room.users.get(userId)
    if ( !roomUser ) { throw new Error("userOrderとusersの整合性が取れていません") }
    const user = roomUser.user

    users.push({
      id: user.id,
      name: user.name,
      image: user.image,
      batonHolder: room.batonHolderId === user.id,
    })
  }

  return JSON.stringify({
    type: 'roomstate',
    users: users,
    chat: room.chat,
    batonHolderId: room.batonHolderId,
    paragraphsRemains: room.maxParagraphs - room.paragraphCount
  })
}

app.get(
    '/relaytale/ws',
    upgradeWebSocket(async (c) => {
      const token = c.req.query("token");
      if (!token) throw new Error("token is required");
      const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET || "");
      if (!payload) throw new Error("Invalid token");

      const taleId = c.req.query('taleId')
      const tale = await prisma.tale.findUnique({
        where: {
          id: taleId
        },
        include: {
          paragraphs: true
        }
      })
      console.log(tale)
      if (!tale) throw new Error("Tale ID not found")

      const user = await prisma.user.findUnique({
        where: {
          id: (payload as any).user
        }
      })
      if (!user) throw new Error("User not found")

      console.log(`-> ${user.name} (${user.id}) が物語${tale.id} に参加しようとしています`)

      let room = rooms.get(taleId)
      if ( room && room.userOrder.includes(user.id) ) {
        throw new Error("You are currently joining this room!")
      }
      
      if (!room) {
        room = {
          users: new Map(),
          userOrder: [],
          batonHolderId: null,
          chat: [],
          lastParagraphId: tale.paragraphs.length > 0
            ? tale.paragraphs[tale.paragraphs.length - 1].userId
            : null,
          paragraphCount: tale.paragraphs.length,
          maxParagraphs: 18
        }
        rooms.set(taleId, room)
        console.log(`-> roomがなかったので作成しました。`)
      }
      if (!room) throw new Error("Failed to create room")

      return {
        onOpen(event, ws) {
          room.users.set(user.id, { user: user, ws: ws })
          room.userOrder.push(user.id)
          console.log(`-> ${user.name} (${user.id}) がルームに参加しました`)

          const chatMsg = JSON.stringify({
            type: 'error',
            content: `${user.name} joined the room!`
          });
          for (const client of room.users.values()) {
            client.ws.send(chatMsg);
          }

          // ルーム状態が変わるので改めてroomstateを告知
          const message = createRoomstateForClient(room);
          for (const client of room.users.values()) {
            client.ws.send(message);
          }

          // もし今作ったとか、１人しかいなかったところに入ったとかでnullなら回す
          if (room.batonHolderId === null) {
            console.log(`-> 現在バトンを持っている人はいないので、回します`)
            rotateBatonAndBroadcast(room, tale)
          }
        },
        async onMessage(event, ws) {
          const data = JSON.parse(event.data)

          if ( data.type === "write_paragraph" ) {
            if ( room.batonHolderId !== user.id ) {
              ws.send(JSON.stringify({
                type: 'error',
                content: 'You are not baton holder!'
              }))
              return
            }
            if ( data.content.trim() === "" ) {
              ws.send(JSON.stringify({
                type: 'error',
                content: 'There is no content!'
              }))
              return
            }

            const paragraph = await prisma.paragraph.create({
              data: {
                taleId: taleId,
                userId: user.id,
                content: data.content
              }
            })
            room.lastParagraphId = user.id
            const message = JSON.stringify({
              type: 'new_paragraph',
              content: {
                id: paragraph.id,
                user: {
                  name: user.name,
                  image: user.image
                },
                content: paragraph.content,
                createdAt: paragraph.createdAt
              },
              paragraphsRemains: room.maxParagraphs - room.paragraphCount
            });

            for (const client of room.users.values()) {
              client.ws.send(message);
            }

            room.paragraphCount += 1

            if ( room.paragraphCount >= room.maxParagraphs ) {
              // FINISH
              await prisma.tale.update({
                where: {
                  id: tale.id
                },
                data: {
                  finished: true
                }
              })
              const finishMessage = JSON.stringify({
                type: 'finish',
                id: tale.id
              });
              for (const client of room.users.values()) {
                client.ws.send(finishMessage);
                client.ws.close()
              }
              rooms.delete(tale.id)
              return
            }

            await rotateBatonAndBroadcast(room, tale);
          }
          if ( data.type === 'pass' ) {
            rotateBatonAndBroadcast(room, tale);
          }
        },
        onClose: async (event, ws) => {
          console.log(`-> ${user.name} (${user.id}) です。さようなら。`)
          room.users.delete(user.id);
          console.log(`-> ${room.userOrder}`)
          console.log(`-> ${room.userOrder.indexOf(user.id)}`)
          const idx = room.userOrder.indexOf(user.id);
          let nextHolder: string | null = null;
          if (room.batonHolderId === user.id && room.userOrder.length > 1) {
            // 削除前に次インデックスを計算
            const nextIdx = (idx + 1) % room.userOrder.length;
            nextHolder = room.userOrder[nextIdx];
          }

          room.userOrder.splice(idx, 1);
          
          // ルーム状態が変わるので改めてroomstateを告知
          const message = createRoomstateForClient(room);
          for (const client of room.users.values()) {
            client.ws.send(message);
          }

          if (nextHolder) {
            room.batonHolderId = nextHolder;
            rotateBatonAndBroadcast(room, tale);
          }

          const chatMsg = JSON.stringify({
            type: 'error',
            content: `${user.name} left the room`
          });
          for (const client of room.users.values()) {
            client.ws.send(chatMsg);
          }

          if ( room.userOrder.length === 0 ) {
            rooms.delete(tale.id)
            return
          }
        },
      }
    })
  )

export { injectWebSocket }
export default app

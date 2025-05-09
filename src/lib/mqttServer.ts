// src/lib/mqttServer.ts
import mqtt from 'mqtt'
import { prisma } from '@/lib/prisma'      // we’ll use this in the next step

/* 1️⃣  Connection details
   - UI is publishing over WebSocket: ws://localhost:9001
   - The broker usually exposes the *same* topic over plain TCP too (mqtt://localhost:1883).
   - Use whichever URL reaches your broker from the server side.
*/
const BROKER_URL = process.env.MQTT_SERVER_URL ?? 'mqtt://localhost:1883'
const TOPIC      = process.env.MQTT_TOPIC      ?? 'cell/parameters'

console.log('[MQTT‑S] mqttServer.ts loaded')


/* 2️⃣  Create ONE persistent client even during hot‑reload */
export const mqttSub =
  (global as any).mqttSub || mqtt.connect(BROKER_URL)

if (!(global as any).mqttSubInit) {
  mqttSub.on('connect', () => {
    console.log('[MQTT‑S] connected ‑ subscribing to', TOPIC)
    mqttSub.subscribe(TOPIC)
  })

  mqttSub.on('message', async (_topic, payload) => {
    // 1️⃣  Parse JSON safely
    let data: any
    try {
      data = JSON.parse(payload.toString())
    } catch {
      console.error('[MQTT‑S] bad JSON:', payload.toString())
      return
    }
  
    console.log('[MQTT‑S] incoming:', data)
  
    /* Expected payload (adjust if your UI sends different keys)
       {
         "tool": "Tool A",
         "feedRate": 100,
         "spindleSpeed": 100,
         "userId": 123,           // optional
         "cellId": 1,
         "recipeId": 12
       }
    */
  
    // 2️⃣  Insert a HoleData row
    try {
      await prisma.holeData.create({
        data: {
          userId:       data.userId       ?? 0,
          cellId:       data.cellId       ?? 0,
          recipeId:     data.recipeId     ?? 0,
          feedRate:     data.feedRate,
          spindleSpeed: data.spindleSpeed
          // timestamp is auto‑now()
        }
      })
    } catch (err) {
      console.error('[DB] holeData insert failed', err)
      return
    }
  
    // 3️⃣  Increment numberOfUses for the tool
    try {
      await prisma.toolData.updateMany({
        where: { name: data.tool },
        data:  { numberOfUses: { increment: 1 } }
      })
    } catch (err) {
      console.error('[DB] toolData update failed', err)
    }
  })
  

  mqttSub.on('error', console.error)

  ;(global as any).mqttSubInit = true
}

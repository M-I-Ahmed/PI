// src/lib/mqttServer.ts
import mqtt from 'mqtt'
import { prisma } from '@/lib/prisma'
import { EventEmitter } from 'events'

/* ------------------------------------------------------------------ */
/* Globals survive hot‑reload                                         */
/* ------------------------------------------------------------------ */
const g = global as any
g.sseEmitter      = g.sseEmitter      || new EventEmitter()
g.currentToolName = g.currentToolName || null
g.mqttSub         = g.mqttSub         || null
g.mqttSubInit     = g.mqttSubInit     || false

export const sseEmitter: EventEmitter = g.sseEmitter

/* ------------------------------------------------------------------ */
/* MQTT setup                                                         */
/* ------------------------------------------------------------------ */
const BROKER_URL = process.env.MQTT_SERVER_URL ?? 'mqtt://localhost:1883'
const TOPIC      = process.env.MQTT_TOPIC      ?? 'HoleData'
const LOG_TOPIC = process.env.MQTT_LOG_TOPIC   ?? 'events/log' 

console.log('[MQTT‑S] mqttServer.ts loaded')
export const mqttSub = g.mqttSub || mqtt.connect(BROKER_URL)

if (!g.mqttSubInit) {
  mqttSub.on('connect', () => {
    console.log('[MQTT‑S] connected – subscribing to', TOPIC)
    mqttSub.subscribe(TOPIC)
    mqttSub.subscribe(LOG_TOPIC)
  })

  mqttSub.on('message', async (_topic, buf) => {
    /* ===== 0️⃣  LOG TOPIC (no DB write) =========================== */
    if (_topic === LOG_TOPIC) {
      const raw = buf.toString()  // text or JSON string
      console.log('[MQTT-S] Log message received:', raw)
      
      // Just emit the raw message string directly
      // Let the client side decide how to handle/display it
      sseEmitter.emit('log', raw)
      return
    }
  
    /* ===== 1️⃣  DRILL TOPIC  ====================================== */
    if (_topic !== TOPIC) return          // ignore anything else
  
    /* parse JSON safely */
    let data: any
    try {
      data = JSON.parse(buf.toString())
    } catch {
      console.error('[MQTT‑S] bad JSON:', buf.toString())
      return
    }
    console.log('[MQTT‑S] incoming:', data)
  
    /* current tool -------------------------------------------------- */
    const toolName = typeof data.tool === 'string' ? data.tool.trim() : null
  
    if (toolName) {
      g.currentToolName = toolName
      console.log('[MQTT‑S] currentToolName →', toolName)
  
      /* ensure tool row exists (find‑or‑create) */
      const exists = await prisma.toolData.findFirst({
        where: { name: toolName },
        select: { id: true },
      })
      if (!exists) {
        await prisma.toolData.create({
          data: {
            name: toolName,
            diameter: 0,
            length: 0,
            numberOfUses: 0,
            inspectionFrequency: 100,
          },
        })
      }
    }
  
    /* insert HoleData ---------------------------------------------- */
    try {
      await prisma.holeData.create({
        data: {
          userId:       0,
          cellId:       0,
          recipeId:     Number(data.recipeNum ?? 0),
          feedRate:     Number(data.feedRate     ?? 0),
          spindleSpeed: Number(data.spindleSpeed ?? 0),
        },
      })
    } catch (err) {
      console.error('[DB] holeData insert failed', err)
      return
    }
  
    /* increment usage ---------------------------------------------- */
    if (toolName) {
      try {
        await prisma.toolData.updateMany({
          where: { name: toolName },
          data:  { numberOfUses: { increment: 1 } },
        })
      } catch (err) {
        console.error('[DB] toolData update failed', err)
      }
    }
  
    /* broadcast SSE payload (update channel) ------------------------ */
    const outPayload = {
      toolName,
      xOffset:       data['X Offset'],
      yOffset:       data['Y Offset'],
      depth:         data.holeDepth,
      recipeNum:     data.recipeNum,
      process:       data.process,
      robot:         data.robot,
      feedRate:      Number(data.feedRate     ?? 0),
      spindleSpeed:  Number(data.spindleSpeed ?? 0),
      timestamp:     Date.now(),
    }
  
    sseEmitter.emit('update', JSON.stringify(outPayload))
  })
  
  mqttSub.on('error', console.error)

  g.mqttSubInit = true
  g.mqttSub     = mqttSub
}
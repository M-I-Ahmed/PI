import { NextResponse } from 'next/server'
import { sseEmitter } from '@/lib/mqttServer'

export const dynamic = 'force-dynamic' // keep connection open in App Router

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(`data: ${data}\n\n`)
      }

      // heartbeat every 25 s so proxies stay open
      const hb = setInterval(() => controller.enqueue(':\n\n'), 25_000)

      // initial hello
      send(JSON.stringify({ hello: true }))

      // subscribe to updates
      sseEmitter.on('update', send)

      controller.onclose = () => {
        clearInterval(hb)
        sseEmitter.off('update', send)
      }
    },
  })

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

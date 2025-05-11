import { NextResponse } from 'next/server'
import { sseEmitter } from '@/lib/mqttServer'

export async function GET(req: Request) {
  const { signal } = req   // ← will fire when client closes connection

  const stream = new ReadableStream({
    start(controller) {
      /* send each update */
      function onMsg(data: string) {
        controller.enqueue(`data: ${data}\n\n`)
      }

      /* keep‑alive every 25 s */
      const hb = setInterval(() => controller.enqueue(':\n\n'), 25_000)

      sseEmitter.on('update', onMsg)

      /* cleanup when browser tab closes */
      signal.addEventListener('abort', () => {
        clearInterval(hb)
        sseEmitter.off('update', onMsg)
        controller.close()
      })
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

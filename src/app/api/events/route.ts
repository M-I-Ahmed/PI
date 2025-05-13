import { NextResponse } from 'next/server'
import { sseEmitter } from '@/lib/mqttServer'

export async function GET(req: Request) {
  const { signal } = req

  const stream = new ReadableStream({
    start(controller) {
      /* handy helper */
      const push = (type: string, data: string) =>
        controller.enqueue(`event: ${type}\ndata: ${data}\n\n`)

      const onUpdate = (d: string) => push('update', d)
      const onLog    = (d: string) => push('log',    d)

      sseEmitter.on('update', onUpdate)
      sseEmitter.on('log',    onLog)

      /* keep‑alive ping */
      const hb = setInterval(() => controller.enqueue(':\n\n'), 25_000)

      signal.addEventListener('abort', () => {
        clearInterval(hb)
        sseEmitter.off('update', onUpdate)
        sseEmitter.off('log',    onLog)
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection:      'keep-alive',
    },
  })
}

'use client'
import { useEffect } from 'react'

type UpdateMsg = {
  toolName: string | null
  feedRate?: number
  spindleSpeed?: number
  timestamp: number
}

export function useLiveUpdates(onMsg: (m: UpdateMsg) => void) {
  useEffect(() => {
    const es = new EventSource('/api/events')
    es.onmessage = (e) => {
      try {
        const data: UpdateMsg = JSON.parse(e.data)
        onMsg(data)
      } catch {/* ignore malformed */}
    }
    return () => es.close()
  }, [onMsg])
}

// src/components/MessageLog.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'
import { format } from 'date-fns'    // npm i date-fns  (if not already)

type Msg = {
  payload: string
  ts: number
}

export default function MessageLog() {
  const [log, setLog] = useState<Msg[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  /* push each SSE message onto the log (keep 50) */
  useLiveUpdates((raw) => {
    setLog((prev) =>
      [{ payload: JSON.stringify(raw), ts: raw.timestamp }]
        .concat(prev)
        .slice(0, 50)
    )
  })

  /* auto‑scroll to newest */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [log])

  return (
    <div
      ref={scrollRef}
      className="h-[260px] overflow-y-auto space-y-2 p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-700 text-white"
    >
      {log.length === 0 ? (
        <p className="text-sm text-gray-400">No messages received yet.</p>
      ) : (
        log.map((m, i) => (
          <div key={i} className="text-xs leading-snug">
            <span className="text-cyan-400 mr-2">
              [{format(m.ts, 'HH:mm:ss')}]
            </span>
            {m.payload}
          </div>
        ))
      )}
    </div>
  )
}

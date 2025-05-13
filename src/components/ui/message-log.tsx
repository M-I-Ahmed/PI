// src/components/ui/message-log.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

type Msg = { ts: number; payload: any }

export default function MessageLog() {
  const [log, setLog] = useState<Msg[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useLiveUpdates(payload => {
    setLog(prev => [{ ts: Date.now(), payload }].concat(prev).slice(0, 20))
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [log])

  return (
    <div className="flex-[2] bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Message Log</h2>
      <div
        ref={scrollRef}
        className="h-[260px] overflow-y-auto flex flex-col-reverse gap-3"
      >
        <AnimatePresence initial={false}>
          {log.map((m, i) => (
            <motion.div
              key={m.ts}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 border border-cyan-700 rounded-xl p-3"
            >
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="text-cyan-400">
                  [{format(m.ts, 'HH:mm:ss')}]
                </span>
                <span>#{log.length - i}</span>
              </div>
              <pre className="whitespace-pre-wrap text-[11px] text-white">
                {typeof m.payload === 'string'
                  ? m.payload
                  : JSON.stringify(m.payload, null, 2)}
              </pre>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

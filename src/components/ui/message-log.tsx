'use client'

import { useEffect, useRef, useState } from 'react'
import { useMqtt } from '@/lib/usemqtt'

type Message = {
  content: string
  timestamp: string
}

export default function MessageLog() {
  const { client } = useMqtt()
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!client) return

    const topic = 'events/log'

    const handleMessage = (topic: string, payload: Buffer) => {
      const msg = payload.toString()
      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      setMessages((prev) => [...prev, { content: msg, timestamp: time }])
    }

    client.subscribe(topic)
    client.on('message', handleMessage)

    return () => {
      client.unsubscribe(topic)
      client.off('message', handleMessage)
    }
  }, [client])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-[260px] overflow-y-auto space-y-2 p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-700 text-white" ref={scrollRef}>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-400">No messages received yet.</p>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="text-cyan-400 mr-2">[{msg.timestamp}]</span>
            <span>{msg.content}</span>
          </div>
        ))
      )}
    </div>
  )
}

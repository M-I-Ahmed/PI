// src/components/message-log.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

type LogMessage = {
  id: number
  timestamp: string
  content: string
}

export default function MessageLog() {
  const [messages, setMessages] = useState<LogMessage[]>([])
  const messageCountRef = useRef(0)
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Use the live updates hook to get real-time messages
  useLiveUpdates((data, eventType) => {
    console.log("MessageLog received data:", data, "Event type:", eventType)
    
    // Only process messages from the 'log' event type (events/log topic)
    if (eventType !== 'log') {
      return;
    }
    
    // Convert the data to a displayable string regardless of type
    let contentStr: string
    
    if (typeof data === 'string') {
      // Already a string, use as is
      contentStr = data
    } else if (data === null) {
      contentStr = 'null'
    } else if (typeof data === 'object') {
      // Format objects nicely
      try {
        contentStr = JSON.stringify(data, null, 2)
      } catch (error) {
        contentStr = String(data)
      }
    } else {
      // For other types (numbers, booleans, etc.)
      contentStr = String(data)
    }
    
    // Create a new message entry
    const newMessage = {
      id: messageCountRef.current++,
      timestamp: new Date().toLocaleTimeString(),
      content: contentStr
    }
    
    // Add to our messages array
    setMessages(prev => [...prev, newMessage])
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col rounded-xl  text-white h-full mr-6">
      <h2 className="text-lg font-semibold mb-4">Message Log</h2>
      
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto text-sm font-mono"
        style={{ maxHeight: '300px' }}
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 italic">No messages yet. Waiting for events...</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="mb-3 border-l-2 border-cyan-500 pl-2">
              <div className="text-cyan-400 text-xs">[{msg.timestamp}]</div>
              <pre className="whitespace-pre-wrap text-gray-300 mt-1">
                {msg.content}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
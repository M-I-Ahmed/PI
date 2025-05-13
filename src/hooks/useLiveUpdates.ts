// src/hooks/useLiveUpdates.ts
'use client'
import { useEffect, useCallback } from 'react'

type EventCallback = (data: any, eventType?: string) => void;

export function useLiveUpdates(cb: EventCallback) {
  useEffect(() => {
    console.log("Setting up EventSource connection")
    
    // relative URL uses same origin + correct port
    const es = new EventSource('/api/stream')

    es.onopen = () => {
      console.log("EventSource connection opened")
    }

    // General message handler (fallback)
    es.onmessage = (evt) => {
      console.log("EventSource received general message:", evt.data)
      try { 
        cb(JSON.parse(evt.data), 'message') 
      }
      catch { 
        cb(evt.data, 'message') 
      }
    }

    // Specific handler for update events
    es.addEventListener('update', (evt) => {
      console.log("EventSource received update event:", evt.data)
      try {
        cb(JSON.parse(evt.data), 'update')
      } catch {
        cb(evt.data, 'update')
      }
    })

    // Specific handler for log events
    es.addEventListener('log', (evt) => {
      console.log("EventSource received log event:", evt.data)
      try {
        cb(evt.data, 'log')
      } catch {
        cb(evt.data, 'log')
      }
    })

    es.onerror = (err) => {
      console.error("EventSource error:", err)
      es.close()
    }
    
    return () => {
      console.log("Closing EventSource connection")
      es.close()
    }
  }, [cb])
}
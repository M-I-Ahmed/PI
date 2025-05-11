// src/hooks/useCurrentTool.ts
'use client'
import { useEffect, useState } from 'react'
import { useLiveUpdates } from './useLiveUpdates'

export function useCurrentTool() {
  const [tool, setTool] = useState<string | null>(null)

  /* 1️⃣  initial fetch */
  useEffect(() => {
    fetch('/api/current-tool')
      .then((r) => r.json())
      .then((d) => setTool(d.name ?? null))
      .catch(() => setTool(null))
  }, [])

  /* 2️⃣  update on every SSE event */
  useLiveUpdates((msg) => {
    if (msg.toolName && msg.toolName !== tool) {
      setTool(msg.toolName)
    }
  })

  return tool
}

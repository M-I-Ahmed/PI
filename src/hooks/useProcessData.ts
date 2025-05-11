'use client'
import { useState, useEffect } from 'react'
import { useLiveUpdates } from './useLiveUpdates'

type Payload = {
  toolName: string | null
  feedRate?: number
  spindleSpeed?: number
  programId?: number
  recipeId?: number
  processTypeId?: number
  holeType?: string
  cellId?: number
  timestamp: number
}

/* returns [latestPayload, messageLog] */
export function useProcessData() {
  const [latest, setLatest]   = useState<Payload | null>(null)
  const [log, setLog]         = useState<Payload[]>([])

  /* Listen to every SSE event */
  useLiveUpdates((msg) => {
    const p = msg as Payload
    setLatest(p)
    setLog((old) =>
      [p, ...old].slice(0, 20) // keep 20 most‑recent
    )
  })

  /* SSR safety: no initial value */
  return [latest, log] as const
}

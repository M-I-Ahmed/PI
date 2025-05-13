// src/components/ui/currentProcessPanel.tsx
'use client'
import { useState } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

type Payload = {
  process?: string
  feedRate?: number
  spindleSpeed?: number
  recipeNum?: number
  toolName?: string
}

export default function CurrentProcessPanel() {
  const [last, setLast] = useState<Payload>({})

  useLiveUpdates(msg => {
    if (msg.process !== undefined) setLast(msg)
  })

  const row = (label: string, v?: string | number) => (
    <li>
      <strong className="text-white">{label}:</strong>{' '}
      <span className="text-gray-300">{v ?? '—'}</span>
    </li>
  )

  return (
    <div className="flex-[1] bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Current Process</h2>
      <ul className="space-y-1 text-sm">
        {row('Process Type', last.process)}
        {row('Feed Rate',    last.feedRate)}
        {row('Spindle Speed',last.spindleSpeed)}
        {row('Recipe',       last.recipeNum)}
        {row('Tool',         last.toolName)}
      </ul>
    </div>
  )
}


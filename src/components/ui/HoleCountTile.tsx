// src/components/HoleCountTile.tsx
'use client'

import { useEffect, useState } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

export default function HoleCountTile() {
  const [count, setCount] = useState<number | null>(null)

  /* initial fetch */
  useEffect(() => {
    fetch('/api/hole-count')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? null))
      .catch(() => setCount(null))
  }, [])

  /* live increment only on HoleData events */
  useLiveUpdates((message, eventType) => {
    // Only increment on 'update' events from HoleData topic
    if (eventType === 'update') {
      setCount((c) => (c === null ? c : c + 1))
    }
  })

  return (
    <MetricShell label="No. of Cycles Completed">
      {count === null ? '—' : count.toLocaleString('en-US')}
    </MetricShell>
  )
}

function MetricShell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-white font-semibold text-sm text-center p-4 rounded-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow h-40">
      <div>{label}</div>
      <div className="text-cyan-400 text-4xl mt-4">{children}</div>
    </div>
  )
}
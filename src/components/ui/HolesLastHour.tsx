// src/components/HolesLastHour.tsx
'use client'

import { useEffect, useState } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

export default function HolesLastHour() {
  const [count, setCount] = useState<number | null>(null)

  /* function to fetch fresh value */
  const fetchCount = () =>
    fetch('/api/hole-count/hour')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? null))
      .catch(() => setCount(null))

  /* initial + 30‑s poll (handles roll‑over as rows age out) */
  useEffect(() => {
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    return () => clearInterval(id)
  }, [])

  /* live bump when a new hole is drilled */
  useLiveUpdates(() => {
    // new hole always counts for the next hour
    setCount((c) => (c === null ? c : c + 1))
  })

  return (
    <MetricShell label="Holes Drilled in Last Hour">
      {count === null ? '—' : count}
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
    <div className="flex flex-col items-center justify-center text-white font-semibold text-sm text-center p-4 rounded-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow">
      <div>{label}</div>
      <div className="text-cyan-400 text-3xl mt-2">{children}</div>
    </div>
  )
}

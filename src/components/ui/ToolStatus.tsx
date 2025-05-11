// src/components/ToolStatus.tsx
'use client'

import { useEffect, useState } from 'react'
import { useCurrentTool } from '@/hooks/useCurrentTool'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

type ToolRow = {
  id: number
  name: string
  cyclesLeft: number
}

export default function ToolStatus() {
  /* 1️⃣ which tool are we tracking? */
  const toolName = useCurrentTool()

  const [tool, setTool] = useState<ToolRow | null>(null)

  /* 2️⃣ initial fetch (or when toolName changes) */
  useEffect(() => {
    if (!toolName) return
    fetch('/api/tool-data')
      .then((r) => r.json())
      .then((rows: ToolRow[]) =>
        setTool(rows.find((t) => t.name === toolName) ?? null),
      )
      .catch(() => setTool(null))
  }, [toolName])

  /* 3️⃣ live refresh whenever the server broadcasts an update
        for THIS tool                                             */
  useLiveUpdates((msg) => {
    if (msg.toolName === toolName) {
      // simplest: refetch just this tool’s row
      fetch('/api/tool-data')
        .then((r) => r.json())
        .then((rows: ToolRow[]) =>
          setTool(rows.find((t) => t.name === toolName) ?? null),
        )
        .catch(() => {}) // ignore errors
    }
  })

  /* 4️⃣ render */
  const value =
    tool?.cyclesLeft !== undefined ? tool.cyclesLeft : '—'

  return (
    <MetricShell label="Cycles to Next Drill Bit Change">
      {value}
    </MetricShell>
  )
}

/* ---------------- shared tile styling ---------------- */
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

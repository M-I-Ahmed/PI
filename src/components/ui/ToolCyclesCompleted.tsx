// src/components/ToolCyclesCompleted.tsx
'use client'

import { useEffect, useState } from 'react'
import { useCurrentTool } from '@/hooks/useCurrentTool'

type ToolRow = { name: string; numberOfUses: number }

export default function ToolCyclesCompleted() {
  const toolName = useCurrentTool()
  const [tool, setTool] = useState<ToolRow | null>(null)

  useEffect(() => {
    if (!toolName) return
    fetch('/api/tool-data')
      .then((r) => r.json())
      .then((rows: ToolRow[]) =>
        setTool(rows.find((t) => t.name === toolName) ?? null),
      )
      .catch(() => setTool(null))
  }, [toolName])

  const value =
    tool?.numberOfUses !== undefined
      ? tool.numberOfUses.toLocaleString('en-US')
      : '—'

  return (
    <MetricShell label="No. of Cycles Completed">
      {value}
    </MetricShell>
  )
}


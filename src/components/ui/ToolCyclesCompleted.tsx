// src/components/ToolStatus.tsx
'use client'
import { useEffect, useState } from 'react'
import { useCurrentTool } from '@/hooks/useCurrentTool'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

type ToolWithCycles = {
  id: number
  name: string
  cyclesLeft: number
}

export default function ToolStatus() {
  const toolName = useCurrentTool()
  const [cyclesLeft, setCyclesLeft] = useState<number | null>(null)

  // Function to fetch current tool cycles
  const fetchToolData = () => {
    if (!toolName) {
      setCyclesLeft(null)
      return
    }
    
    // Fetch all tools data
    fetch('/api/tool-data')
      .then(res => res.json())
      .then(tools => {
        // Find the current tool
        const currentTool = tools.find((t: ToolWithCycles) => t.name === toolName)
        if (currentTool) {
          setCyclesLeft(currentTool.cyclesLeft)
        } else {
          setCyclesLeft(null)
        }
      })
      .catch(err => {
        console.error('[Component] Error fetching tool data:', err)
        setCyclesLeft(null)
      })
  }

  // Initial fetch when tool changes
  useEffect(() => {
    fetchToolData()
  }, [toolName])

  // Listen for updates - only from HoleData topic
  useLiveUpdates((message, eventType) => {
    // Only react to update events (HoleData topic)
    if (eventType !== 'update') {
      return;
    }
    
    fetchToolData()
  })

  // Display value
  const displayValue = cyclesLeft !== null ? cyclesLeft : '—'

  return (
    <div className="flex flex-col items-center justify-center text-white font-semibold text-sm text-center p-4 rounded-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow h-40">
      <div>Cycles to Next Drill Bit Change</div>
      <div className="text-cyan-400 text-4xl mt-4">{displayValue}</div>
    </div>
  )
}
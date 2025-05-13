// src/components/HolesLastHour.tsx
'use client'
import { useEffect, useState } from 'react'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

export default function HolesLastHour() {
  const [count, setCount] = useState<number | null>(null)
  
  // Function to fetch hole count for the last hour
  const fetchHolesLastHour = () => {
    fetch('/api/hole-count/hour')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setCount(data.count)
        }
      })
      .catch(err => {
        console.error('[Component] Error fetching holes in last hour:', err)
      })
  }

  // Initial fetch
  useEffect(() => {
    fetchHolesLastHour()
  }, [])
  
  // Update when SSE events come in - only from HoleData topic
  useLiveUpdates((message, eventType) => {
    // Only react to update events (HoleData topic)
    if (eventType !== 'update') {
      return;
    }
    
    fetchHolesLastHour()
  })

  const displayValue = count !== null ? count.toLocaleString('en-US') : '—'

  return (
    <div className="flex flex-col items-center justify-center text-white font-semibold text-sm text-center p-4 rounded-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow h-40">
      <div>Holes Drilled in Last Hour</div>
      <div className="text-cyan-400 text-4xl mt-4">{displayValue}</div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'

type Widget = {
  id: number
  name: string
  value: number
  createdAt: string
}

export default function WidgetList() {
  const [widgets, setWidgets] = useState<Widget[]>([])

  useEffect(() => {
    fetch('/api/widgets')
      .then((r) => r.json())
      .then(setWidgets)
      .catch(console.error)
  }, [])

  if (widgets.length === 0) {
    return <p className="text-sm text-gray-500">No widgets yet…</p>
  }

  return (
    <ul className="space-y-2">
      {widgets.map((w) => (
        <li
          key={w.id}
          className="border rounded p-2 flex justify-between items-center"
        >
          <span>{w.name}</span>
          <span className="font-mono text-sm">{w.value}</span>
        </li>
      ))}
    </ul>
  )
}

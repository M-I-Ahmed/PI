'use client'
import { useProcessData } from '@/hooks/useProcessData'

export default function CurrentProcessPanel() {
  const [p] = useProcessData()

  const field = (label: string, value?: string | number | null) => (
    <li>
      <strong className="text-white">{label}:</strong>{' '}
      {value ?? '—'}
    </li>
  )

  return (
    <div className="flex-[1] bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white rounded-2xl p-9 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Current Process</h2>
      <ul className="space-y-1 text-sm text-gray-300">
        {field('Process Type',  p?.process)}
        {field('Feed Rate',     p?.feedRate)}
        {field('Spindle Speed', p?.spindleSpeed)}
        {field('Recipe',        p?.recipeNum)}
        {field('Tool',          p?.toolName)}
      </ul>
    </div>
  )
}

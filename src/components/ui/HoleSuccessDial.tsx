// src/components/ui/HoleSuccessDial.tsx
'use client'

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

export default function HoleSuccessDial() {
  /* 1️⃣ success rate (swap to live value any time) */
  const pct = 80

  const data = [{ name: 'success', value: pct, fill: '#22d3ee' }]

  return (
    <MetricShell label="Hole Success Rate (Dial)">
      <div className="relative w-24 h-24">
        <RadialBarChart
          width={96}
          height={96}
          cx="50%"
          cy="50%"
          innerRadius="80%"
          outerRadius="100%"
          barSize={16}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          {/* fixes scaling: 0 = empty, 100 = full circle */}
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

          {/* removed minAngle to match Recharts typings */}
          <RadialBar
            dataKey="value"
            clockWise
            background={{ fill: '#334155' }}
          />
        </RadialBarChart>

        {/* centred % label */}
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-xl font-semibold">
          {pct}%
        </div>
      </div>
    </MetricShell>
  )
}

/* ---- shared shell ---- */
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
      {children}
    </div>
  )
}

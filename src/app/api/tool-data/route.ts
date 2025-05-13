// src/app/api/tool-data/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // fetch the rows; TS knows the return type from Prisma Client
  const tools = await prisma.toolData.findMany()

  // infer the element type
  type ToolRow = typeof tools[number]

  // explicitly type the map callback parameter so there's no implicit any
  const withCycles: Array<ToolRow & { cyclesLeft: number }> = tools.map(
    (t: ToolRow) => ({
      ...t,
      cyclesLeft: t.inspectionFrequency - t.numberOfUses,
    }),
  )

  return NextResponse.json(withCycles)
}

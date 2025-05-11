import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const tools = await prisma.toolData.findMany({
      orderBy: { id: 'asc' }
    })
  
    // add cyclesLeft on the fly
    const withCycles = tools.map((t) => ({
      ...t,
      cyclesLeft: t.inspectionFrequency - t.numberOfUses,
    }))
  
    return NextResponse.json(withCycles)
}

export async function POST(request: Request) {
  const data = await request.json()
  const row  = await prisma.toolData.create({ data })
  return NextResponse.json(row, { status: 201 })
}

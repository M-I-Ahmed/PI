import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rows = await prisma.toolData.findMany({
    orderBy: { id: 'asc' }
  })
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const data = await request.json()
  const row  = await prisma.toolData.create({ data })
  return NextResponse.json(row, { status: 201 })
}

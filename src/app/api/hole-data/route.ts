import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/* -------- GET /api/hole-data -------- */
export async function GET() {
  const rows = await prisma.holeData.findMany({
    orderBy: { id: 'asc' }
  })
  return NextResponse.json(rows)
}

/* -------- POST /api/hole-data --------
   expected JSON body:
   {
     "userId": 123,
     "cellId": 1,
     "recipeId": 456,
     "feedRate": 150,
     "spindleSpeed": 3200
   }
--------------------------------------- */
export async function POST(request: Request) {
  const data = await request.json()
  const row  = await prisma.holeData.create({ data })
  return NextResponse.json(row, { status: 201 })
}

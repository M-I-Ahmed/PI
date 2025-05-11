import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // 1 hour = 60 min × 60 s × 1000 ms
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const count = await prisma.holeData.count({
    where: { timestamp: { gte: oneHourAgo } },
  })

  return NextResponse.json({ count })
}


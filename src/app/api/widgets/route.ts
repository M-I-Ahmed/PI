// src/app/api/widgets/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'   // relative path up to src/lib/prisma.ts

// GET /api/widgets  →  returns every row
export async function GET() {
  const widgets = await prisma.widget.findMany()
  return NextResponse.json(widgets)
}

// POST /api/widgets  →  creates one row
export async function POST(request: Request) {
  const data = await request.json()
  const widget = await prisma.widget.create({ data })
  return NextResponse.json(widget, { status: 201 })
}

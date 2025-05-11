import { NextResponse } from 'next/server'

export async function GET() {
  const name = (global as any).currentToolName ?? null
  return NextResponse.json({ name })
}

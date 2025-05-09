// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances in development hot‑reload
export const prisma =
  globalThis.prisma || new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

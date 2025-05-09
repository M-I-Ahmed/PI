// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  /* ---------- 10 rows for HoleData ---------- */
  await prisma.holeData.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      // Hole IDs will be 1‑10 automatically (autoincrement)
      timestamp: new Date(),          // now
      userId:   100 + i,              // 100, 101, …
      cellId:   1,                    // same cell for demo
      recipeId: 200 + i,              // 200, 201, …
      feedRate: 150 + i * 5,          // 150, 155, …
      spindleSpeed: 3000 + i * 100    // 3000, 3100, …
    }))
  })

  /* ---------- 4 rows for ToolData ---------- */
  await prisma.toolData.createMany({
    data: [
      { name: 'Tool001', diameter: 10, length: 120, numberOfUses: 0,   inspectionFrequency: 100 },
      { name: 'Tool002', diameter: 8,  length: 110, numberOfUses: 20,  inspectionFrequency: 80  },
      { name: 'Tool003', diameter: 6,  length: 90,  numberOfUses: 50,  inspectionFrequency: 60  },
      { name: 'Tool004', diameter: 12, length: 130, numberOfUses: 5,   inspectionFrequency: 120 }
    ]
  })

  console.log('✅  Sample data inserted')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

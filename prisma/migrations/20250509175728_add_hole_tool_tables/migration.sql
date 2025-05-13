/*
  Warnings:

  - You are about to drop the `Widget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Widget";

-- CreateTable
CREATE TABLE "HoleData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "cellId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "feedRate" DOUBLE PRECISION NOT NULL,
    "spindleSpeed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HoleData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "numberOfUses" INTEGER NOT NULL,
    "inspectionFrequency" INTEGER NOT NULL,

    CONSTRAINT "ToolData_pkey" PRIMARY KEY ("id")
);

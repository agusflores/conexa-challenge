/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Film` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Film_externalId_key" ON "Film"("externalId");

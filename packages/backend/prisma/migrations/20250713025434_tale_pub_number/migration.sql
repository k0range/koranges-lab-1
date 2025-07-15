/*
  Warnings:

  - A unique constraint covering the columns `[pubNumber]` on the table `Tale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "relaytale"."Tale" ADD COLUMN     "pubNumber" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "Tale_pubNumber_key" ON "relaytale"."Tale"("pubNumber");

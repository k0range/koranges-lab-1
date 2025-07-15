/*
  Warnings:

  - Added the required column `beginning` to the `Tale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "relaytale"."Tale" ADD COLUMN     "beginning" TEXT NOT NULL;

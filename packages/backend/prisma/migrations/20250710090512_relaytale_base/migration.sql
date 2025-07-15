-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "relaytale";

-- CreateTable
CREATE TABLE "relaytale"."Tale" (
    "id" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "lang" TEXT NOT NULL,

    CONSTRAINT "Tale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relaytale"."Paragraph" (
    "id" TEXT NOT NULL,
    "taleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relaytale"."Paragraph" ADD CONSTRAINT "Paragraph_taleId_fkey" FOREIGN KEY ("taleId") REFERENCES "relaytale"."Tale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relaytale"."Paragraph" ADD CONSTRAINT "Paragraph_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

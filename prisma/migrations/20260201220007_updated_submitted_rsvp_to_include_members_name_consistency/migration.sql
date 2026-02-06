/*
  Warnings:

  - You are about to drop the column `submittedRSVP` on the `Invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "submittedRSVP",
ADD COLUMN     "submittedRSVPMembers" TEXT[];

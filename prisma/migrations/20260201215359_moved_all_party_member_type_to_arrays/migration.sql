/*
  Warnings:

  - You are about to drop the column `partySize` on the `Invitation` table. All the data in the column will be lost.
  - The `partyMembers` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `submittedRSVP` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `acceptingMembers` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "partySize",
DROP COLUMN "partyMembers",
ADD COLUMN     "partyMembers" TEXT[],
DROP COLUMN "submittedRSVP",
ADD COLUMN     "submittedRSVP" TEXT[],
DROP COLUMN "acceptingMembers",
ADD COLUMN     "acceptingMembers" TEXT[];

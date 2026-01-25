-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "partyMembers" TEXT NOT NULL,
    "submittedRSVP" BOOLEAN NOT NULL,
    "acceptingMembers" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

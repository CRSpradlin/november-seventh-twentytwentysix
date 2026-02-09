"use server";

import { Invitation, PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter
});

export async function getInvitationByCode(invitationCode: string) {
  return await prisma.invitation.findFirst({
    where: {
      invitationCode,
    },
  });
}

export async function updateInvitation(invitation: Invitation) {
  return await prisma.invitation.update({
    where: {
      id: invitation.id,
    },
    data: invitation,
  });
}

// export { prisma };

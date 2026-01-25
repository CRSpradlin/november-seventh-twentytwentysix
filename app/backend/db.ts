import { PrismaClient } from '@/app/generated/prisma/client';
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

// export { prisma };

import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getInvitationByCode } from '@/app/backend/db';

interface PageProps {
  params: Promise<{
    invitationCode: string;
  }>;
}

export default async function RSVPPage({ params }: PageProps) {
  const { invitationCode } = await params;

  // Validate the invitation code exists in the database
  const invitation = await getInvitationByCode(invitationCode);
  
  // If invitation code is not valid, show 404
  if (!invitation) {
    notFound();
  }

  // Set the invitation code as a cookie
  const cookieStore = await cookies();
  cookieStore.set('invitationCode', invitationCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 365 days
    path: '/',
  });

  // Redirect to the main page or RSVP form
  redirect('/');
}

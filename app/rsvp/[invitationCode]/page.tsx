"use client";

import { notFound, redirect } from 'next/navigation';
import { getInvitationByCode } from '@/app/backend/db';
import { setInvitationCodeCookie } from '@/app/backend/cookies';
import { useEffect } from 'react';

interface PageProps {
    params: Promise<{
        invitationCode: string;
    }>;
}

export default function RSVPPage({ params }: PageProps) {

    useEffect(() => {
        const handleInvitation = async () => {
            const { invitationCode } = await params;

            // Validate the invitation code exists in the database
            const invitation = await getInvitationByCode(invitationCode);

            // If invitation code is not valid, show 404
            if (!invitation) {
                notFound();
            }

            await setInvitationCodeCookie(invitationCode);

            // Redirect to the main page or RSVP form
            redirect('/');
        };

        handleInvitation();
    }, [params]);

    return null; // This page does not render anything itself

}

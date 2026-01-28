"use client";

import { redirect } from 'next/navigation';
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
        const handleInvitationCodeCheck = async () => {
            const { invitationCode } = await params;

            if (!invitationCode || invitationCode.trim() === "") {
                // If no invitation code is provided, redirect to home
                redirect('/');
            }

            // Validate the invitation code exists in the database
            const invitation = await getInvitationByCode(invitationCode);

            // If invitation code is not valid, show 404
            if (invitation !== undefined && invitation !== null) {
                await setInvitationCodeCookie(invitationCode);
            }

            // Redirect to the main page or RSVP form
            redirect('/');
        };

        handleInvitationCodeCheck();
    }, [params,]);

    return null; // Since we're redirecting, no need to render anything
}
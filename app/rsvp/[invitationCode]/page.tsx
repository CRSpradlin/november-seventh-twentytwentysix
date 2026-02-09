"use client";

import { useRouter } from 'next/navigation';
import { getInvitationByCode } from '@/app/backend/db';
import { setInvitationCodeCookie } from '@/app/backend/cookies';
import { useEffect } from 'react';

import { useInvitationStore } from "@/stores/useInvitationStore";

interface PageProps {
    params: Promise<{
        invitationCode: string;
    }>;
}

export default function RSVPPage({ params }: PageProps) {
    const router = useRouter();

    useEffect(() => {
        const handleInvitationCodeCheck = async () => {
            const { invitationCode } = await params;

            if (!invitationCode || invitationCode.trim() === "") {
                // If no invitation code is provided, redirect to home
                router.push('/');
                return;
            }

            // Validate the invitation code exists in the database
            const invitation = await getInvitationByCode(invitationCode);

            if (invitation !== undefined && invitation !== null) {
                await setInvitationCodeCookie(invitationCode);
                // set invitation in global state if needed
                useInvitationStore.getState().setInvitation(invitation);
            }

            // Redirect to the main page
            router.push('/');
        };

        handleInvitationCodeCheck();
    }, [params, router]);

    return null; // Since we're redirecting, no need to render anything
}
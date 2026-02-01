'use client';

import { useEffect } from 'react';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { getInvitationByCode } from '../backend/db';
import { getInvitationCodeCookie } from '../backend/cookies';

export function InvitationLoader() {
  const setInvitation = useInvitationStore((state) => state.setInvitation);

  useEffect(() => {
    // Fetch invitation data from the API
    const loadInvitation = async () => {
      try {
        // pull invitation code from cookiestore
        const invitationCode =await getInvitationCodeCookie();
        
        if (invitationCode !== null) {

            const invitation = await getInvitationByCode(invitationCode)
            if (invitation) {
                setInvitation(invitation);
            }
        }
      } catch (error) {
        console.error('Error loading invitation:', error);
      }
    };

    loadInvitation();
  }, [setInvitation]);

  // This component doesn't render anything
  return null;
}

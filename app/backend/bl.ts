"use server";

import { getInvitationByCode, updateInvitation } from './db';

export async function updateInvitationAttendance(invitationCode: string, attendingMembers: string[]) {
    const invitation = await getInvitationByCode(invitationCode);
    if (!invitation) {
        throw new Error('Invitation not found');
    }

    // Update the invitation's attending members
    const updatedInvitation = {
        ...invitation,
        attendingMembers: attendingMembers.join(', '), // Assuming attendingMembers is stored as a comma-separated string
    };

    return await updateInvitation(updatedInvitation);
}
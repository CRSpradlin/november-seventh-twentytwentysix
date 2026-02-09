"use server";

import { setAdminSessionCookie, getAdminSessionCookie, deleteAdminSessionCookie } from './cookies';
import { createInvitation } from './db';

export async function adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return { success: false, error: 'Admin password not configured' };
    }

    if (password !== adminPassword) {
        return { success: false, error: 'Invalid password' };
    }

    await setAdminSessionCookie();
    return { success: true };
}

export async function checkAdminAuth(): Promise<boolean> {
    return await getAdminSessionCookie();
}

export async function adminLogout(): Promise<{ success: boolean }> {
    await deleteAdminSessionCookie();
    return { success: true };
}

export async function adminCreateInvitation(
    displayName: string,
    invitationCode: string,
    partyMembers: string[]
): Promise<{ success: boolean; error?: string }> {
    // Check authentication
    const isAuthenticated = await getAdminSessionCookie();
    
    if (!isAuthenticated) {
        return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    if (!displayName || !invitationCode || !partyMembers || !Array.isArray(partyMembers)) {
        return { success: false, error: 'Invalid input data' };
    }

    try {
        await createInvitation(displayName, invitationCode, partyMembers);
        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Failed to create invitation' };
    }
}

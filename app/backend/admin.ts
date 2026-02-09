"use server";

import { setAdminSessionCookie, getAdminSessionCookie, deleteAdminSessionCookie, checkLoginRateLimit, resetLoginAttempts } from './cookies';
import { createInvitation, getAllInvitations, deleteInvitation } from './db';
import { headers } from 'next/headers';

export async function adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
    
    // Check rate limit
    const rateLimit = await checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
        return { success: false, error: `Too many login attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.` };
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return { success: false, error: 'Admin password not configured' };
    }

    if (password !== adminPassword) {
        return { success: false, error: 'Invalid password' };
    }

    // Reset rate limit on successful login
    await resetLoginAttempts(ip);
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

export async function adminDeleteInvitation(id: number): Promise<{ success: boolean; error?: string }> {
    const isAuthenticated = await getAdminSessionCookie();

    if (!isAuthenticated) {
        return { success: false, error: 'Unauthorized' };
    }

    if (!id || typeof id !== 'number') {
        return { success: false, error: 'Invalid invitation ID' };
    }

    try {
        await deleteInvitation(id);
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to delete invitation' };
    }
}

export async function adminGetAllInvitations(): Promise<{ success: boolean; invitations?: Awaited<ReturnType<typeof getAllInvitations>>; error?: string }> {
    const isAuthenticated = await getAdminSessionCookie();

    if (!isAuthenticated) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const invitations = await getAllInvitations();
        return { success: true, invitations };
    } catch {
        return { success: false, error: 'Failed to fetch invitations' };
    }
}

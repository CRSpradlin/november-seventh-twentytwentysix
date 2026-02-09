"use server";

import { setAdminSessionCookie, getAdminSessionCookie, deleteAdminSessionCookie, checkLoginRateLimit, resetLoginAttempts } from './cookies';
import { createInvitation } from './db';
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

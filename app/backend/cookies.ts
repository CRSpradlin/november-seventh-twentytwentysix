"use server";
import { cookies } from 'next/headers';

export async function setInvitationCodeCookie(invitationCode: string) {
    // Set the invitation code as a cookie
    const cookieStore = await cookies();
    cookieStore.set('invitation_code', invitationCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 365 days
        path: '/',
    });
}

export async function getInvitationCodeCookie() {
    const cookieStore = await cookies();
    const invitationCode = cookieStore.get('invitation_code');
    return invitationCode ? invitationCode.value : null;
}

import crypto from 'crypto';

// Generate a secure random token for admin sessions
function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Store the valid session token in memory (server-side only)
const validSessionTokens = new Set<string>();

// Track login attempts for basic rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function checkLoginRateLimit(ip: string): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (!attempts) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return { allowed: true };
    }

    // Reset if lockout period has passed
    if (now - attempts.lastAttempt > LOGIN_LOCKOUT_DURATION) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return { allowed: true };
    }

    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        const retryAfterSeconds = Math.ceil((LOGIN_LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 1000);
        return { allowed: false, retryAfterSeconds };
    }

    attempts.count += 1;
    attempts.lastAttempt = now;
    return { allowed: true };
}

export async function resetLoginAttempts(ip: string) {
    loginAttempts.delete(ip);
}

export async function setAdminSessionCookie() {
    const cookieStore = await cookies();
    const token = generateSessionToken();
    validSessionTokens.add(token);
    cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
    });
}

export async function getAdminSessionCookie() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    if (!adminSession?.value) return false;
    return validSessionTokens.has(adminSession.value);
}

export async function deleteAdminSessionCookie() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    if (adminSession?.value) {
        validSessionTokens.delete(adminSession.value);
    }
    cookieStore.delete('admin_session');
}
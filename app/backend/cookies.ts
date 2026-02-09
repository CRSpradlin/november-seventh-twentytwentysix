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

// Use ADMIN_PASSWORD as the HMAC secret for signing session tokens
function getSessionSecret(): string {
    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) throw new Error('ADMIN_PASSWORD not configured');
    return secret;
}

// Generate an HMAC-signed session token: "timestamp.signature"
function generateSessionToken(): string {
    const timestamp = Date.now().toString();
    const signature = crypto
        .createHmac('sha256', getSessionSecret())
        .update(timestamp)
        .digest('hex');
    return `${timestamp}.${signature}`;
}

// Verify an HMAC-signed session token
function verifySessionToken(token: string, maxAgeMs: number): boolean {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [timestamp, signature] = parts;
    const age = Date.now() - parseInt(timestamp, 10);
    if (isNaN(age) || age < 0 || age > maxAgeMs) return false;

    const expectedSignature = crypto
        .createHmac('sha256', getSessionSecret())
        .update(timestamp)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

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
    cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: '/',
    });
}

export async function getAdminSessionCookie() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    if (!adminSession?.value) return false;
    try {
        return verifySessionToken(adminSession.value, SESSION_MAX_AGE_SECONDS * 1000);
    } catch {
        return false;
    }
}

export async function deleteAdminSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
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

export async function setAdminSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
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
    return adminSession?.value === 'authenticated';
}

export async function deleteAdminSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
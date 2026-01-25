"use server";
import { cookies } from 'next/headers';

export async function setInvitationCodeCookie(invitationCode: string) {
    // Set the invitation code as a cookie
    const cookieStore = await cookies();
    cookieStore.set('invitationCode', invitationCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 365 days
        path: '/',
    });
}

export async function getInvitationCodeCookie() {
    const cookieStore = await cookies();
    const invitationCode = cookieStore.get('invitationCode');
    return invitationCode ? invitationCode.value : null;
}
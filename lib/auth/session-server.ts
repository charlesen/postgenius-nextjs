import { cookies } from 'next/headers';
import { verifyToken, signToken } from './session';
import { NewUser } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';
import { and, eq, isNull } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

type SessionData = {
    user: { id: number };
    expires: string;
};

export async function getSession() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie || !sessionCookie.value) return null;

    const sessionData = await verifyToken(sessionCookie.value);
    return sessionData;
}

export async function setSession(user: NewUser) {
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session: SessionData = {
        user: { id: user.id! },
        expires: expiresInOneDay.toISOString(),
    };
    const encryptedSession = await signToken(session);

    const cookieStore = await cookies();
    cookieStore.set('session', encryptedSession, {
        expires: expiresInOneDay,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    });
}


export async function getUser() {
    const sessionData = await getSession();
    if (
        !sessionData ||
        !sessionData.user ||
        typeof sessionData.user.id !== 'number' ||
        new Date(sessionData.expires) < new Date()
    ) {
        return null;
    }

    const user = await db
        .select()
        .from(users)
        .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
        .limit(1);

    return user[0] || null;
}

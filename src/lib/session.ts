import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET is not set');
    }
    return new TextEncoder().encode(secret);
}

export type SessionPayload = {
    id: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(now)
        .setExpirationTime(now + SESSION_TTL_SECONDS)
        .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSessionSecret());
        if (typeof payload.id !== 'string' || payload.id.length === 0) {
            return null;
        }
        return { id: payload.id };
    } catch {
        return null;
    }
}

export const sessionCookieConfig = {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_TTL_SECONDS,
};

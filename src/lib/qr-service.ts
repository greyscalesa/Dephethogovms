import { SignJWT, jwtVerify } from 'jose';
import { Visitor } from './types';

const SECRET = new TextEncoder().encode(process.env.QR_SECRET || 'fallback-secret-for-development-qr-signing');

export async function generateQrToken(visitorId: string, expiryInMinutes: number = 30): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiryInMinutes * 60;

    return new SignJWT({ visitorId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(iat)
        .setExpirationTime(exp)
        .sign(SECRET);
}

export async function verifyQrToken(token: string): Promise<{ visitorId: string } | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as { visitorId: string };
    } catch (err) {
        console.error('QR Token verification failed:', err);
        return null;
    }
}

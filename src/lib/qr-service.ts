import { SignJWT, jwtVerify } from 'jose';
import { Visitor } from './types';

const SECRET = new TextEncoder().encode(process.env.QR_SECRET || 'fallback-secret-for-development-qr-signing');

export async function generateQrToken(visitor: Visitor, expiryInMinutes: number = 30): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiryInMinutes * 60;

    return new SignJWT({ 
        visit_id: visitor.id,
        visitor_name: visitor.name,
        site_id: visitor.siteId,
        expiry_timestamp: exp,
        entry_type: visitor.entryType || 'ONE_TIME'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(iat)
        .setExpirationTime(exp)
        .sign(SECRET);
}

export async function verifyQrToken(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (err) {
        console.error('QR Token verification failed:', err);
        return null;
    }
}

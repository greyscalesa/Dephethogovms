import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';
import { verifyQrToken } from '@/lib/qr-service';
import { VisitorStatus } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        
        if (!token) {
            return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
        }

        // 1. Verify token signature and expiry
        const payload = await verifyQrToken(token);
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid or expired QR token' }, { status: 403 });
        }

        const { visitorId } = payload;
        const db = readDb();
        const visitorIndex = db.visitors.findIndex((v: any) => v.id === visitorId);

        if (visitorIndex === -1) {
            return NextResponse.json({ success: false, error: 'Visitor not found' }, { status: 404 });
        }

        const visitor = db.visitors[visitorIndex];

        // 2. Check entry type and access permissions
        if (visitor.status === 'ON_SITE' && visitor.entryType !== 'MULTIPLE') {
            return NextResponse.json({ 
                success: false, 
                error: 'Single-entry token already used.', 
                visitorName: visitor.name 
            }, { status: 409 });
        }

        // 3. Mark as checked in
        const now = new Date().toISOString();
        const updatedVisitor = {
            ...visitor,
            status: 'ON_SITE',
            checkedInAt: now,
            checkIn: now,
            scanAttempts: (visitor.scanAttempts || 0) + 1
        };

        db.visitors[visitorIndex] = updatedVisitor;
        writeDb(db);

        return NextResponse.json({
            success: true,
            visitorName: visitor.name,
            checkedInAt: now,
            message: `Welcome, ${visitor.name}!`
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json({ success: false, error: 'Server error during check-in' }, { status: 500 });
    }
}

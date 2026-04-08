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

        const { visit_id: visitorId } = payload;
        const db = readDb();
        let visitorIndex = db.visitors.findIndex((v: any) => v.id === visitorId);
        let visitor;

        if (visitorIndex === -1) {
            // Check if it's a booking
            const bookingIndex = db.bookings?.findIndex((b: any) => b.id === visitorId);
            if (bookingIndex !== -1) {
                const booking = db.bookings[bookingIndex];
                // Convert booking to visitor
                visitor = {
                    id: booking.id,
                    name: booking.visitorName,
                    type: booking.type || 'GUEST',
                    siteId: booking.siteId,
                    hostId: booking.hostId,
                    companyId: 'comp-1',
                    status: 'PENDING',
                    phone: '',
                    createdAt: booking.createdAt
                };
                db.visitors.push(visitor);
                visitorIndex = db.visitors.length - 1;
            } else {
                return NextResponse.json({ success: false, error: 'Visitor or Booking not found' }, { status: 404 });
            }
        }

        visitor = db.visitors[visitorIndex];

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

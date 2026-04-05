import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';
import { v4 as uuidv4 } from 'uuid';

import { generateQrToken } from '@/lib/qr-service';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.visitors);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = readDb();

        const visitId = `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Check for double bookings (same visitor phone, same site, same day)
        const isDuplicate = db.visitors.some((v: any) => 
            v.phone === body.phone && 
            v.arrivalDate === body.arrivalDate && 
            v.siteId === body.siteId &&
            v.status === 'PENDING'
        );

        if (isDuplicate) {
            return NextResponse.json({ success: false, error: 'A pending invitation already exists for this visitor on this day.' }, { status: 409 });
        }
        
        const newVisitor = {
            id: visitId,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            ...body
        };

        // Generate the secure token for the visitor
        const qrToken = await generateQrToken(newVisitor);
        newVisitor.qrToken = qrToken;

        db.visitors.push(newVisitor);
        writeDb(db);

        return NextResponse.json({ 
            success: true, 
            visitor: newVisitor 
        });
    } catch (error) {
        console.error('Visitor creation error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create visitor invitation' }, { status: 500 });
    }
}

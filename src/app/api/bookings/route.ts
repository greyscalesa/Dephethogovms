import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.bookings || []);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = readDb();

    if (!db.bookings) db.bookings = [];

    const qrToken = `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newBooking = {
        id: `b-${Date.now()}`,
        ...body,
        qrToken,
        status: 'PRE_BOOKED',
        createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDb(db);

    return NextResponse.json(newBooking, { status: 201 });
}

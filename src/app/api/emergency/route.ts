import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();

    const incident = {
        id: `inc-${Date.now()}`,
        ...data,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
    };

    db.incidents.push(incident);
    writeDb(db);

    return NextResponse.json(incident);
}

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.incidents);
}

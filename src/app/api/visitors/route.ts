import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.visitors);
}

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();

    const newVisitor = {
        id: `v-${Date.now()}`,
        ...data,
        status: 'ON_SITE',
        checkIn: new Date().toISOString()
    };

    db.visitors.push(newVisitor);
    writeDb(db);

    return NextResponse.json(newVisitor);
}

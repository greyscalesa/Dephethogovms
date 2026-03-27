import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.companies);
}

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();

    const newCompany = {
        id: `comp-${Date.now()}`,
        ...data,
        status: 'ACTIVE'
    };

    db.companies.push(newCompany);
    writeDb(db);

    return NextResponse.json(newCompany);
}

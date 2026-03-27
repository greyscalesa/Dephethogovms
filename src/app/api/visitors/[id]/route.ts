import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const data = await request.json();
    const db = readDb();

    const visitorIndex = db.visitors.findIndex((v: any) => v.id === id);
    if (visitorIndex === -1) {
        return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    const visitor = { ...db.visitors[visitorIndex], ...data };

    if (data.status === 'CHECKED_OUT') {
        visitor.checkOut = new Date().toISOString();
    }

    db.visitors[visitorIndex] = visitor;
    writeDb(db);

    return NextResponse.json(visitor);
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readDb } from '@/lib/data-service';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { id } = JSON.parse(session.value);
        const db = readDb();
        const user = db.users.find((u: any) => u.id === id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}

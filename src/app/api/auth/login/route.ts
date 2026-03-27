import { NextResponse } from 'next/server';
import { readDb } from '@/lib/data-service';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const db = readDb();

    const user = db.users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app, I'd set a secure cookie here. For now, I'll just return the user info.
    const response = NextResponse.json({ user });
    response.cookies.set('session', JSON.stringify({ id: user.id }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .limit(1);

        if (error) throw error;

        const user = users?.[0];
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Map to frontend format
        const mappedUser = {
            id: user.id,
            companyId: user.company_id,
            siteId: user.site_id,
            role: user.role,
            fullName: user.full_name,
            email: user.email,
            department: user.department,
            isHost: user.is_host,
        };

        const response = NextResponse.json({ user: mappedUser });
        response.cookies.set('session', JSON.stringify({ id: user.id }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
    }
}

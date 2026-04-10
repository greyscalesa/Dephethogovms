import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { sessionCookieConfig, verifySessionToken } from '@/lib/session';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(sessionCookieConfig.name);

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifySessionToken(session.value);
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', payload.id)
            .limit(1);

        if (error) throw error;

        const user = users?.[0];
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user.id,
                companyId: user.company_id,
                siteId: user.site_id,
                role: user.role,
                fullName: user.full_name,
                email: user.email,
                department: user.department,
                isHost: user.is_host,
            },
        });
    } catch (err) {
        console.error('Auth/me error:', err);
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}

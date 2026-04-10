import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { createSessionToken, sessionCookieConfig } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .limit(1);

        if (error) throw error;

        const user = users?.[0];
        const storedPassword = typeof user?.password === 'string' ? user.password : '';
        const isBcryptHash = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');
        const passwordIsValid = isBcryptHash ? await bcrypt.compare(password, storedPassword) : storedPassword === password;

        if (!user || !passwordIsValid) {
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
        const sessionToken = await createSessionToken({ id: user.id });
        response.cookies.set(sessionCookieConfig.name, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: sessionCookieConfig.maxAge,
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
    }
}

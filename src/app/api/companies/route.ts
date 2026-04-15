import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

export async function GET() {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let query = supabase.from('companies').select('*');
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            query = query.eq('id', authUser.companyId);
        }

        const { data: companies, error } = await query;
        if (error) throw error;
        return NextResponse.json(companies || []);
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Companies GET error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!isPlatformAdmin(authUser)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const data = await request.json();

        const newCompany = {
            id: `comp-${Date.now()}`,
            name: data.name,
            domain: data.domain || '',
            status: 'ACTIVE',
        };

        const { error } = await supabase.from('companies').insert([newCompany]);
        if (error) throw error;

        return NextResponse.json(newCompany);
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Company POST error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');
        const siteId = searchParams.get('siteId');

        let query = supabase.from('users').select('*').eq('role', 'EMPLOYEE');

        if (companyId) {
            query = query.eq('company_id', companyId);
        }
        if (siteId) {
            query = query.eq('site_id', siteId);
        }

        const { data: employees, error } = await query;
        if (error) throw error;

        // Map to camelCase for frontend
        const mapped = (employees || []).map((e: any) => ({
            id: e.id,
            companyId: e.company_id,
            siteId: e.site_id,
            role: e.role,
            fullName: e.full_name,
            email: e.email,
            department: e.department,
            isHost: e.is_host,
        }));

        return NextResponse.json(mapped);
    } catch (error: any) {
        console.error('Employees GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newEmployee = {
            id: `u-${Date.now()}`,
            company_id: data.companyId || 'comp-1',
            site_id: data.siteId || null,
            role: 'EMPLOYEE',
            full_name: data.fullName,
            email: data.email,
            password: data.password || 'password123',
            department: data.department || '',
            is_host: data.isHost || false,
        };

        const { error } = await supabase.from('users').insert([newEmployee]);
        if (error) throw error;

        return NextResponse.json({
            id: newEmployee.id,
            companyId: newEmployee.company_id,
            siteId: newEmployee.site_id,
            role: newEmployee.role,
            fullName: newEmployee.full_name,
            email: newEmployee.email,
            department: newEmployee.department,
            isHost: newEmployee.is_host,
        });
    } catch (error: any) {
        console.error('Employee POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

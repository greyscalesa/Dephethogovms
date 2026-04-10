import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

export async function GET(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');
        const siteId = searchParams.get('siteId');

        if (companyId && !canAccessCompany(authUser, companyId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (siteId && !canAccessSite(authUser, siteId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        let query = supabase.from('users').select('*').eq('role', 'EMPLOYEE');

        if (companyId) {
            query = query.eq('company_id', companyId);
        } else if (!isPlatformAdmin(authUser) && authUser.companyId) {
            query = query.eq('company_id', authUser.companyId);
        }
        if (siteId) {
            query = query.eq('site_id', siteId);
        } else if (!isPlatformAdmin(authUser) && authUser.siteId) {
            query = query.eq('site_id', authUser.siteId);
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
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const targetCompanyId = data.companyId || authUser.companyId;
        if (!canAccessCompany(authUser, targetCompanyId) || !canAccessSite(authUser, data.siteId || authUser.siteId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);

        const newEmployee = {
            id: `u-${Date.now()}`,
            company_id: targetCompanyId,
            site_id: data.siteId || authUser.siteId || null,
            role: 'EMPLOYEE',
            full_name: data.fullName,
            email: data.email,
            password: hashedPassword,
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

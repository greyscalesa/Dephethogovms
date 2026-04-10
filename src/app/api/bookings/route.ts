import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

export async function GET() {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let query = supabase.from('bookings').select('*');
    if (!isPlatformAdmin(authUser) && authUser.companyId) {
        query = query.eq('company_id', authUser.companyId);
    }
    if (!isPlatformAdmin(authUser) && authUser.siteId) {
        query = query.eq('site_id', authUser.siteId);
    }
    const { data: bookings, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(bookings || []);
}

export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const targetCompanyId = body.companyId || authUser.companyId;
        if (!canAccessCompany(authUser, targetCompanyId) || !canAccessSite(authUser, body.siteId)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const qrToken = `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newBooking = {
            id: `b-${Date.now()}`,
            ...body,
            company_id: targetCompanyId,
            qr_token: qrToken,
            status: 'PRE_BOOKED',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('bookings').insert([newBooking]);
        if (error) throw error;

        // Map snake_case back to camelCase for the frontend expectation
        return NextResponse.json({ ...newBooking, qrToken: newBooking.qr_token, createdAt: newBooking.created_at }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

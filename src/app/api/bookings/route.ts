import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

function mapBookingToFrontend(b: any) {
    return {
        id: b.id,
        visitorName: b.visitor_name,
        company: b.company,
        scheduledTime: b.scheduled_time,
        siteId: b.site_id,
        hostId: b.host_id,
        type: b.type,
        status: b.status,
        qrToken: b.qr_token,
        createdAt: b.created_at
    };
}

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
    return NextResponse.json((bookings || []).map(mapBookingToFrontend));
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
            visitor_name: body.visitorName,
            company: body.company || '',
            scheduled_time: body.scheduledTime || '',
            site_id: body.siteId,
            host_id: body.hostId || 'u-4',
            type: body.type || 'GUEST',
            status: 'PRE_BOOKED',
            qr_token: qrToken,
            company_id: targetCompanyId,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('bookings').insert([newBooking]);
        if (error) throw error;

        // Map back to camelCase for the frontend
        return NextResponse.json({
            id: newBooking.id,
            visitorName: newBooking.visitor_name,
            company: newBooking.company,
            scheduledTime: newBooking.scheduled_time,
            siteId: newBooking.site_id,
            hostId: newBooking.host_id,
            type: newBooking.type,
            status: newBooking.status,
            qrToken: newBooking.qr_token,
            createdAt: newBooking.created_at
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

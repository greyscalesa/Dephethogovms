import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

function mapBookingToFrontend(b: Record<string, any>) {
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

export async function GET(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('pageSize') || '10');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const order = searchParams.get('order') || 'desc';

        const offset = (page - 1) * limit;

        const fields = 'id, visitor_name, company, scheduled_time, site_id, host_id, type, status, qr_token, created_at, company_id, id_number, purpose, reg_number, vin';

        let query = supabase.from('bookings').select(fields, { count: 'exact' });

        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            query = query.eq('company_id', authUser.companyId);
        }
        if (siteId && siteId !== 'all') {
            query = query.eq('site_id', siteId);
        } else if (!isPlatformAdmin(authUser) && authUser.siteId) {
            query = query.eq('site_id', authUser.siteId);
        }

        if (status && status !== 'ALL') {
            query = query.eq('status', status);
        }
        if (search) {
            query = query.or(`visitor_name.ilike.%${search}%,company.ilike.%${search}%,purpose.ilike.%${search}%`);
        }

        const { data: bookings, error, count } = await query
            .order(sortBy, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            data: (bookings || []).map(mapBookingToFrontend),
            pagination: {
                page,
                pageSize: limit,
                total: count || 0,
                totalPages: count ? Math.ceil(count / limit) : 0
            }
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Bookings GET error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
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
            id_number: body.idNumber || '',
            purpose: body.purpose || '',
            scheduled_time: body.scheduledTime || '',
            site_id: body.siteId,
            host_id: body.hostId || 'u-4',
            type: body.type || 'GUEST',
            status: 'PRE_BOOKED',
            qr_token: qrToken,
            company_id: targetCompanyId,
            reg_number: body.regNumber || '',
            vin: body.vin || '',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('bookings').insert([newBooking]);
        if (error) throw error;

        // Map back to camelCase for the frontend
        return NextResponse.json({
            id: newBooking.id,
            visitorName: newBooking.visitor_name,
            company: newBooking.company,
            idNumber: newBooking.id_number,
            purpose: newBooking.purpose,
            scheduledTime: newBooking.scheduled_time,
            siteId: newBooking.site_id,
            hostId: newBooking.host_id,
            type: newBooking.type,
            status: newBooking.status,
            qrToken: newBooking.qr_token,
            regNumber: newBooking.reg_number,
            vin: newBooking.vin,
            createdAt: newBooking.created_at
        }, { status: 201 });


    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

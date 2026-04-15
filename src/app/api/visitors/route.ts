import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateQrToken } from '@/lib/qr-service';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

function mapVisitorToFrontend(v: any) {
    return {
        id: v.id,
        companyId: v.company_id,
        siteId: v.site_id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        company: v.company,
        type: v.type,
        status: v.status,
        hostId: v.host_id,
        hostName: v.host_name,
        qrToken: v.qr_token,
        tokenExpiry: v.token_expiry,
        scanAttempts: v.scan_attempts,
        checkIn: v.check_in,
        checkOut: v.check_out,
        createdAt: v.created_at,
        arrivalDate: v.arrival_date,
        arrivalTime: v.arrival_time,
        duration: v.duration,
        purpose: v.purpose,
        regNumber: v.reg_number,
        vin: v.vin,
        entryType: v.entry_type,
        earlyCheckInMinutes: v.early_check_in_minutes,
        idNumber: v.id_number,
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

        // Base fields we actually need in the UI
        const fields = 'id, company_id, site_id, name, email, phone, company, type, status, host_id, host_name, qr_token, token_expiry, scan_attempts, check_in, check_out, created_at, arrival_date, arrival_time, duration, purpose, reg_number, vin, entry_type, early_check_in_minutes, id_number';

        let query = supabase.from('visitors').select(fields, { count: 'exact' });

        // Scoping
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            query = query.eq('company_id', authUser.companyId);
        }
        if (siteId && siteId !== 'all') {
            if (!canAccessSite(authUser, siteId)) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            query = query.eq('site_id', siteId);
        } else if (!isPlatformAdmin(authUser) && authUser.siteId) {
            query = query.eq('site_id', authUser.siteId);
        }

        // Filtering
        if (status && status !== 'ALL') {
            query = query.eq('status', status);
        }
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`);
        }

        // Sorting & Pagination
        const { data: visitors, error, count } = await query
            .order(sortBy, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            data: (visitors || []).map(mapVisitorToFrontend),
            pagination: {
                page,
                pageSize: limit,
                total: count || 0,
                totalPages: count ? Math.ceil(count / limit) : 0
            }
        });
    } catch (error: any) {
        console.error('Visitors GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
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
        const visitId = `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Check for duplicate pending invitations
        const { data: existing } = await supabase
            .from('visitors')
            .select('id')
            .eq('phone', body.phone || '')
            .eq('arrival_date', body.arrivalDate || '')
            .eq('site_id', body.siteId || '')
            .eq('status', 'PENDING');

        if (existing && existing.length > 0) {
            return NextResponse.json(
                { success: false, error: 'A pending invitation already exists for this visitor on this day.' },
                { status: 409 }
            );
        }

        // Build the visitor record for Supabase (snake_case)
        const newVisitorDb: Record<string, any> = {
            id: visitId,
            status: 'PENDING',
            created_at: new Date().toISOString(),
            name: body.name,
            email: body.email || '',
            phone: body.phone || '',
            company: body.company || '',
            id_number: body.idNumber || '',
            type: body.type || 'GUEST',
            site_id: body.siteId,
            host_id: body.hostId,
            host_name: body.hostName || '',
            company_id: targetCompanyId,
            purpose: body.purpose || '',
            arrival_date: body.arrivalDate || '',
            arrival_time: body.arrivalTime || '',
            duration: body.duration || '',
            reg_number: body.regNumber || '',
            vin: body.vin || '',
            entry_type: body.entryType || 'ONE_TIME',
            early_check_in_minutes: body.earlyCheckInMinutes || 30,
        };

        // Generate secure QR token (needs camelCase visitor shape)
        const visitorForToken = {
            id: visitId,
            name: body.name,
            siteId: body.siteId,
            entryType: body.entryType || 'ONE_TIME',
        };
        const qrToken = await generateQrToken(visitorForToken as any);
        newVisitorDb.qr_token = qrToken;

        const { error } = await supabase.from('visitors').insert([newVisitorDb]);
        if (error) throw error;

        return NextResponse.json({
            success: true,
            visitor: mapVisitorToFrontend(newVisitorDb),
        });
    } catch (error: any) {
        console.error('Visitor creation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create visitor invitation' },
            { status: 500 }
        );
    }
}

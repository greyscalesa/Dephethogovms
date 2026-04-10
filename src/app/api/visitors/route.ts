import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateQrToken } from '@/lib/qr-service';

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
        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');

        let query = supabase.from('visitors').select('*');
        if (siteId && siteId !== 'all') {
            query = query.eq('site_id', siteId);
        }

        const { data: visitors, error } = await query;
        if (error) throw error;

        return NextResponse.json((visitors || []).map(mapVisitorToFrontend));
    } catch (error: any) {
        console.error('Visitors GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
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
            company_id: body.companyId || 'comp-1',
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

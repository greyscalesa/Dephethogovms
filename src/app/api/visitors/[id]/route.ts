import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Build the update object in snake_case
        const updateFields: Record<string, any> = {};
        if (data.status !== undefined) updateFields.status = data.status;
        if (data.checkIn !== undefined) updateFields.check_in = data.checkIn;
        if (data.checkOut !== undefined) updateFields.check_out = data.checkOut;
        if (data.name !== undefined) updateFields.name = data.name;
        if (data.phone !== undefined) updateFields.phone = data.phone;
        if (data.email !== undefined) updateFields.email = data.email;
        if (data.type !== undefined) updateFields.type = data.type;

        if (data.status === 'CHECKED_OUT') {
            updateFields.check_out = new Date().toISOString();
        }

        const { data: updated, error } = await supabase
            .from('visitors')
            .update(updateFields)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!updated) {
            return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
        }

        // Map back to camelCase for frontend
        return NextResponse.json({
            ...updated,
            companyId: updated.company_id,
            siteId: updated.site_id,
            hostId: updated.host_id,
            hostName: updated.host_name,
            checkIn: updated.check_in,
            checkOut: updated.check_out,
            qrToken: updated.qr_token,
            createdAt: updated.created_at,
        });
    } catch (error: any) {
        console.error('Visitor PATCH error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

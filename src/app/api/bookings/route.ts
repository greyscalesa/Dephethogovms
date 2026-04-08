import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data: bookings, error } = await supabase.from('bookings').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(bookings || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const qrToken = `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newBooking = {
            id: `b-${Date.now()}`,
            ...body,
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

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');
        const today = new Date().toISOString().split('T')[0];

        // Fetch visitors
        let visitorsQuery = supabase.from('visitors').select('status, check_in, site_id');
        if (siteId && siteId !== 'all') {
            visitorsQuery = visitorsQuery.eq('site_id', siteId);
        }
        const { data: visitors } = await visitorsQuery;

        // Fetch bookings
        let bookingsQuery = supabase.from('bookings').select('scheduled_time, site_id');
        if (siteId && siteId !== 'all') {
            bookingsQuery = bookingsQuery.eq('site_id', siteId);
        }
        const { data: bookings } = await bookingsQuery;

        const visitorList = visitors || [];
        const bookingList = bookings || [];

        const activeVisits = visitorList.filter((v: any) => v.status === 'ON_SITE').length;
        const totalVisitors = visitorList.length;
        const expectedToday = bookingList.filter((b: any) =>
            b.scheduled_time?.startsWith(today)
        ).length;

        const stats = [
            { label: 'ACTIVE VISITS', value: activeVisits.toString(), color: 'bg-blue-50', iconColor: 'text-blue-600' },
            { label: 'EXPECTED TODAY', value: expectedToday.toString(), color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
            { label: 'TOTAL VISITORS', value: totalVisitors.toString(), color: 'bg-orange-50', iconColor: 'text-orange-600' },
        ];

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Stats error:', error);
        return NextResponse.json([], { status: 500 });
    }
}

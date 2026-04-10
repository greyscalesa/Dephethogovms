import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

export async function GET(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');
        const today = new Date().toISOString().split('T')[0];
        if (siteId && siteId !== 'all' && !canAccessSite(authUser, siteId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch visitors
        let visitorsQuery = supabase.from('visitors').select('status, check_in, site_id');
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            visitorsQuery = visitorsQuery.eq('company_id', authUser.companyId);
        }
        if (siteId && siteId !== 'all') {
            visitorsQuery = visitorsQuery.eq('site_id', siteId);
        } else if (!isPlatformAdmin(authUser) && authUser.siteId) {
            visitorsQuery = visitorsQuery.eq('site_id', authUser.siteId);
        }
        const { data: visitors } = await visitorsQuery;

        // Fetch bookings
        let bookingsQuery = supabase.from('bookings').select('scheduled_time, site_id');
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            bookingsQuery = bookingsQuery.eq('company_id', authUser.companyId);
        }
        if (siteId && siteId !== 'all') {
            bookingsQuery = bookingsQuery.eq('site_id', siteId);
        } else if (!isPlatformAdmin(authUser) && authUser.siteId) {
            bookingsQuery = bookingsQuery.eq('site_id', authUser.siteId);
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

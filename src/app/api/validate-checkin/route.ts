import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyQrToken } from '@/lib/qr-service';
import { canAccessCompany, canAccessSite, getAuthenticatedUser } from '@/lib/authz';

export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
        }

        // 1. Verify token signature and expiry
        const payload = await verifyQrToken(token);
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid or expired QR token' }, { status: 403 });
        }

        const { visit_id: visitorId } = payload;

        // 2. Look up visitor
        const { data: visitors } = await supabase
            .from('visitors')
            .select('*')
            .eq('id', visitorId)
            .limit(1);

        let visitor = visitors?.[0];

        if (!visitor) {
            // Check if it's a booking
            const { data: bookings } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', visitorId)
                .limit(1);

            const booking = bookings?.[0];
            if (!booking) {
                return NextResponse.json({ success: false, error: 'Visitor or Booking not found' }, { status: 404 });
            }
            if (!canAccessSite(authUser, booking.site_id) || !canAccessCompany(authUser, booking.company_id || authUser.companyId)) {
                return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
            }

            // Look up host name
            const { data: hostUsers } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', booking.host_id)
                .limit(1);

            // Convert booking to visitor record
            const newVisitor = {
                id: booking.id,
                name: booking.visitor_name,
                type: booking.type || 'GUEST',
                site_id: booking.site_id,
                host_id: booking.host_id,
                host_name: hostUsers?.[0]?.full_name || '',
                company_id: booking.company_id || authUser.companyId,
                status: 'PENDING',
                phone: '',
                created_at: booking.created_at,
            };

            const { error: insertError } = await supabase.from('visitors').insert([newVisitor]);
            if (insertError) throw insertError;

            visitor = newVisitor;
        }
        if (!canAccessSite(authUser, visitor.site_id) || !canAccessCompany(authUser, visitor.company_id || authUser.companyId)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        // 3. Check entry type and access
        if (visitor.status === 'ON_SITE' && visitor.entry_type !== 'MULTIPLE') {
            return NextResponse.json({
                success: false,
                error: 'Single-entry token already used.',
                visitorName: visitor.name,
            }, { status: 409 });
        }

        // 4. Mark as checked in
        const now = new Date().toISOString();
        const { error: updateError } = await supabase
            .from('visitors')
            .update({
                status: 'ON_SITE',
                checked_in_at: now,
                check_in: now,
                scan_attempts: (visitor.scan_attempts || 0) + 1,
            })
            .eq('id', visitor.id);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            visitorName: visitor.name,
            checkedInAt: now,
            message: `Welcome, ${visitor.name}!`,
        });
    } catch (error: any) {
        console.error('Check-in error:', error);
        return NextResponse.json({ success: false, error: 'Server error during check-in' }, { status: 500 });
    }
}

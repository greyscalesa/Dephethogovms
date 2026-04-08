import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: sites, error: sitesError } = await supabase.from('sites').select('*');
        if (sitesError) throw sitesError;

        const { data: visitors, error: visitorsError } = await supabase.from('visitors').select('site_id, status, check_in');
        if (visitorsError) throw visitorsError;

        // Enrich sites with basic stats for the overview
        const sitesWithStats = (sites || []).map((site: any) => {
            const siteVisitors = (visitors || []).filter((v: any) => v.site_id === site.id);
            const visitorsToday = siteVisitors.filter((v: any) => {
                const today = new Date().toISOString().split('T')[0];
                return v.check_in?.startsWith(today);
            }).length;
            const onSiteCount = siteVisitors.filter((v: any) => v.status === 'ON_SITE').length;
            
            return {
                ...site,
                companyId: site.company_id,
                contactNumber: site.contact_number,
                contactEmail: site.contact_email,
                managerId: site.manager_id,
                operatingHours: site.operating_hours,
                maxOccupancy: site.max_occupancy,
                qrPrefix: site.qr_prefix,
                createdAt: site.created_at,
                lastActivityAt: site.last_activity_at,
                stats: {
                    totalVisitorsToday: visitorsToday,
                    onSiteCount: onSiteCount,
                    capacityStatus: onSiteCount / (site.max_occupancy || 100)
                }
            };
        });

        return NextResponse.json(sitesWithStats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        const newSite = {
            id: `site-${Date.now()}`,
            name: data.name,
            type: data.type,
            address: data.address,
            operating_hours: data.operatingHours,
            max_occupancy: data.maxOccupancy,
            status: 'ACTIVE',
            company_id: 'comp-1', // Defaulting to the dummy company
            created_at: new Date().toISOString()
        };
        
        const { error } = await supabase.from('sites').insert([newSite]);
        if (error) throw error;
        
        return NextResponse.json({ ...newSite, operatingHours: newSite.operating_hours, maxOccupancy: newSite.max_occupancy }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessCompany, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';

export async function GET() {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let sitesQuery = supabase.from('sites').select('*');
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            sitesQuery = sitesQuery.eq('company_id', authUser.companyId);
        }

        const { data: sites, error: sitesError } = await sitesQuery;
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
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const targetCompanyId = data.companyId || authUser.companyId;
        if (!canAccessCompany(authUser, targetCompanyId)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        const newSite = {
            id: `site-${Date.now()}`,
            name: data.name,
            type: data.type,
            address: data.address,
            operating_hours: data.operatingHours,
            max_occupancy: data.maxOccupancy,
            status: 'ACTIVE',
            company_id: targetCompanyId,
            created_at: new Date().toISOString()
        };
        
        const { error } = await supabase.from('sites').insert([newSite]);
        if (error) throw error;
        
        return NextResponse.json({ ...newSite, operatingHours: newSite.operating_hours, maxOccupancy: newSite.max_occupancy }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

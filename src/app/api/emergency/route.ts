import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { canAccessCompany, canAccessSite, getAuthenticatedUser, isPlatformAdmin } from '@/lib/authz';
import { Incident } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const targetSiteId = data.siteId || data.site_id || authUser.siteId;
        const targetCompanyId = data.companyId || data.company_id || authUser.companyId;
        if (!canAccessCompany(authUser, targetCompanyId) || !canAccessSite(authUser, targetSiteId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const incident: Incident = {
            id: `inc-${Date.now()}`,
            type: data.type || '',
            description: data.description || '',
            site_id: targetSiteId || null,
            reporter_id: data.reporterId || data.reporter_id || null,
            company_id: targetCompanyId || null,
            severity: data.severity || '',
            timestamp: new Date().toISOString(),
            status: 'ACTIVE',
        };

        const { error } = await supabase.from('incidents').insert([incident]);
        if (error) throw error;

        return NextResponse.json({
            ...incident,
            siteId: incident.site_id,
            reporterId: incident.reporter_id,
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Emergency POST error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let query = supabase
            .from('incidents')
            .select('*')
            .order('timestamp', { ascending: false });
        if (!isPlatformAdmin(authUser) && authUser.companyId) {
            query = query.eq('company_id', authUser.companyId);
        }
        if (!isPlatformAdmin(authUser) && authUser.siteId) {
            query = query.eq('site_id', authUser.siteId);
        }

        const { data: incidents, error } = await query;

        if (error) throw error;

        const mapped = (incidents as Incident[] || []).map((inc: Incident) => ({
            ...inc,
            siteId: inc.site_id,
            reporterId: inc.reporter_id,
        }));

        return NextResponse.json(mapped);
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Emergency GET error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

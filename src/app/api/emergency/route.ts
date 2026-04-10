import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const incident = {
            id: `inc-${Date.now()}`,
            type: data.type || '',
            description: data.description || '',
            site_id: data.siteId || data.site_id || null,
            reporter_id: data.reporterId || data.reporter_id || null,
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
    } catch (error: any) {
        console.error('Emergency POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data: incidents, error } = await supabase
            .from('incidents')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) throw error;

        const mapped = (incidents || []).map((inc: any) => ({
            ...inc,
            siteId: inc.site_id,
            reporterId: inc.reporter_id,
        }));

        return NextResponse.json(mapped);
    } catch (error: any) {
        console.error('Emergency GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

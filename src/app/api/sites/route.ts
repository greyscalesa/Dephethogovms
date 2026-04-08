import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function GET() {
    const db = readDb();
    
    // Enrich sites with basic stats for the overview
    const sitesWithStats = db.sites.map((site: any) => {
        const siteVisitors = db.visitors.filter((v: any) => v.siteId === site.id);
        const visitorsToday = siteVisitors.filter((v: any) => {
            const today = new Date().toISOString().split('T')[0];
            return v.checkIn?.startsWith(today);
        }).length;
        const onSiteCount = siteVisitors.filter((v: any) => v.status === 'ON_SITE').length;
        
        return {
            ...site,
            stats: {
                totalVisitorsToday: visitorsToday,
                onSiteCount: onSiteCount,
                capacityStatus: onSiteCount / (site.maxOccupancy || 100)
            }
        };
    });

    return NextResponse.json(sitesWithStats);
}

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();
    
    const newSite = {
        id: `site-${Date.now()}`,
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    };
    
    db.sites.push(newSite);
    writeDb(db);
    
    return NextResponse.json(newSite);
}

import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const db = readDb();
    let sites = db.sites;

    if (companyId) {
        sites = sites.filter((site: any) => site.companyId === companyId);
    }

    return NextResponse.json(sites);
}

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();

    const newSite = {
        id: `site-${Date.now()}`,
        ...data,
        status: 'ACTIVE'
    };

    db.sites.push(newSite);
    writeDb(db);

    return NextResponse.json(newSite);
}

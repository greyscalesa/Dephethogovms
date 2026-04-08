import { NextResponse } from 'next/server';
import { getStats } from '@/lib/data-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const stats = getStats(siteId || undefined);
    return NextResponse.json(stats);
}

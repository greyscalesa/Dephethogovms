import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

let cachedDb: any = null;
let lastReadTime = 0;
const CACHE_TTL = 1000; // 1 second cache

export function readDb() {
    const now = Date.now();
    if (cachedDb && (now - lastReadTime < CACHE_TTL)) {
        return JSON.parse(JSON.stringify(cachedDb));
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    cachedDb = JSON.parse(data);
    lastReadTime = now;
    return JSON.parse(JSON.stringify(cachedDb));
}

export function writeDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    cachedDb = data;
    lastReadTime = Date.now();
}

export function getStats(siteId?: string) {
    const db = readDb();
    const today = new Date().toISOString().split('T')[0];
    
    let visitors = db.visitors || [];
    let bookings = db.bookings || [];
    
    if (siteId && siteId !== 'all') {
        visitors = visitors.filter((v: any) => v.siteId === siteId);
        bookings = bookings.filter((b: any) => b.siteId === siteId);
    }
    
    const activeVisits = visitors.filter((v: any) => v.status === 'ON_SITE').length;
    const totalVisitors = visitors.length;
    
    return [
        { label: 'ACTIVE VISITS', value: activeVisits.toString(), color: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'EXPECTED TODAY', value: bookings.filter((b: any) => b.scheduledTime.startsWith(today)).length.toString(), color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { label: 'TOTAL VISITORS', value: totalVisitors.toString(), color: 'bg-orange-50', iconColor: 'text-orange-600' }
    ];
}

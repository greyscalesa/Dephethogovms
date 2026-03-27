import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

export function readDb() {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function writeDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getStats() {
    const db = readDb();
    const today = new Date().toISOString().split('T')[0];
    const activeVisits = db.visitors.filter((v: any) => v.status === 'ON_SITE').length;
    const totalVisitors = db.visitors.length;
    // This is a simple mock, real stats would be more complex
    return [
        { label: 'ACTIVE VISITS', value: activeVisits.toString(), color: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'EXPECTED TODAY', value: db.bookings.filter((b: any) => b.scheduledTime.startsWith(today)).length.toString(), color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { label: 'TOTAL VISITORS', value: totalVisitors.toString(), color: 'bg-orange-50', iconColor: 'text-orange-600' }
    ];
}

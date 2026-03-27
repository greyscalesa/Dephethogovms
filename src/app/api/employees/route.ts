import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/data-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const siteId = searchParams.get('siteId');

    const db = readDb();
    let employees = db.users.filter((u: any) => u.role === 'EMPLOYEE');

    if (companyId) {
        employees = employees.filter((e: any) => e.companyId === companyId);
    }
    if (siteId) {
        employees = employees.filter((e: any) => e.siteId === siteId);
    }

    return NextResponse.json(employees);
}

export async function POST(request: Request) {
    const data = await request.json();
    const db = readDb();

    const newEmployee = {
        id: `u-${Date.now()}`,
        ...data,
        role: 'EMPLOYEE',
        password: data.password || 'password123'
    };

    db.users.push(newEmployee);
    writeDb(db);

    return NextResponse.json(newEmployee);
}

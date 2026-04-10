import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: companies, error } = await supabase.from('companies').select('*');
        if (error) throw error;
        return NextResponse.json(companies || []);
    } catch (error: any) {
        console.error('Companies GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newCompany = {
            id: `comp-${Date.now()}`,
            name: data.name,
            domain: data.domain || '',
            status: 'ACTIVE',
        };

        const { error } = await supabase.from('companies').insert([newCompany]);
        if (error) throw error;

        return NextResponse.json(newCompany);
    } catch (error: any) {
        console.error('Company POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

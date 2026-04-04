import React from 'react';
import { readDb } from '@/lib/data-service';
import { generateQrToken } from '@/lib/qr-service';
import VisitorQR from '@/components/VisitorQR';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function VisitorQrPage({ params }: PageProps) {
    const { id } = await params;
    const db = readDb();
    const visitor = db.visitors.find((v: any) => v.id === id);

    if (!visitor) {
        notFound();
    }

    // Generate a secure token for this visitor
    const token = await generateQrToken(visitor.id);

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <nav className="mb-12">
                    <Link 
                        href="/visitors" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Visitors
                    </Link>
                </nav>

                <div className="flex flex-col items-center">
                    <VisitorQR visitor={visitor} token={token} />
                </div>
            </div>
        </div>
    );
}

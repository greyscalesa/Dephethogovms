import React from 'react';
import { supabase } from '@/lib/supabase';
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

    // Look up visitor in Supabase
    const { data: visitors } = await supabase
        .from('visitors')
        .select('*')
        .eq('id', id)
        .limit(1);

    let visitor = visitors?.[0];

    if (!visitor) {
        // Check bookings
        const { data: bookings } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .limit(1);

        const booking = bookings?.[0];
        if (booking) {
            // Look up host name
            const { data: hostUsers } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', booking.host_id)
                .limit(1);

            visitor = {
                ...booking,
                name: booking.visitor_name,
                host_name: hostUsers?.[0]?.full_name || 'Alice Johnson',
                site_id: booking.site_id,
            };
        }
    }

    if (!visitor) {
        notFound();
    }

    // Map to camelCase for the QR token generator
    const visitorMapped = {
        id: visitor.id,
        name: visitor.name || visitor.visitor_name,
        siteId: visitor.site_id,
        entryType: visitor.entry_type || 'ONE_TIME',
        hostName: visitor.host_name,
    };

    const token = await generateQrToken(visitorMapped as any);

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
                    <VisitorQR visitor={visitorMapped as any} token={token} />
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    ShieldCheck,
    Search,
    Plus,
    X,
    Loader2,
    Calendar,
    Filter,
    Download,
    LogOut,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/visitors');
            const data = await res.json();
            // Filter only on-site
            const onsite = data.filter((v: any) => v.status === 'ON_SITE');
            setVisitors(onsite.map((v: any) => {
                const checkInTime = new Date(v.checkIn).getTime();
                const now = Date.now();
                const overstayed = (now - checkInTime) > (4 * 60 * 60 * 1000); // 4 hours limit

                return {
                    ...v,
                    visitor: v.name,
                    checkIn: new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOverstayed: overstayed
                };
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
        const interval = setInterval(fetchVisitors, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckout = async (id: string) => {
        await fetch(`/api/visitors/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'CHECKED_OUT' }),
        });
        fetchVisitors();
    };

    const columns = [
        { header: 'Live Visitor', accessor: 'visitor' },
        { header: 'Site', accessor: 'siteId' },
        { header: 'Checked In', accessor: 'checkIn' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Security Console</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Live oversight of all active persons onsite.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Secure Mode Active
                        </div>
                    </div>
                </div>

                {/* Live Feed Cards */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <Loader2 className="animate-spin text-[#fa922c]" size={48} />
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="p-20 bg-white rounded-[40px] border border-slate-100 text-center text-slate-400 font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-200/40">
                            No active visitors on site.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visitors.map((v) => (
                                <motion.div
                                    layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    key={v.id}
                                    className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden flex flex-col gap-6 ${v.isOverstayed ? 'ring-2 ring-red-500/20' : ''}`}
                                >
                                    {v.isOverstayed && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase animate-bounce">
                                            <AlertCircle size={12} /> Overstayed
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-2xl font-black text-[#042f21]">
                                            {v.visitor.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#042f21] leading-none uppercase tracking-tighter">{v.visitor}</h3>
                                            <p className="text-[10px] font-black text-[#042f21]/30 uppercase tracking-widest mt-2">{v.company}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[8px] font-black text-[#042f21]/30 uppercase tracking-widest mb-1">Check-in</p>
                                            <p className="text-sm font-black text-[#042f21]">{v.checkIn}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[8px] font-black text-[#042f21]/30 uppercase tracking-widest mb-1">Host</p>
                                            <p className="text-sm font-black text-[#042f21] truncate">{v.host}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleCheckout(v.id)}
                                        className="w-full h-14 bg-[#042f21] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#032319] transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                        Manual Force Checkout
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

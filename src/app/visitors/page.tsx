'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    Plus,
    Loader2,
    Calendar,
    Filter,
    Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToPDF } from '@/lib/utils';
import CreateInviteModal from '@/components/CreateInviteModal';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/visitors');
            const data = await res.json();
            setVisitors(data.map((v: any) => ({
                ...v,
                visitor: v.name,
                checkIn: v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
                host: v.hostName || 'Default Host'
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const columns = [
        { header: 'Visitor', accessor: 'visitor' },
        { header: 'Type', accessor: 'type' },
        { header: 'In Time', accessor: 'checkIn' },
        { header: 'Host', accessor: 'host' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10 overflow-y-auto no-scrollbar">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Visitors Check-In</h1>
                        <p className="text-[#042f21]/40 text-sm md:text-base font-bold tracking-tight uppercase">Manage active onsite visits and guest entries.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-center gap-3">
                        <button
                            onClick={() => exportToCSV(visitors, 'vms_active_visitors')}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-100 text-[#042f21] rounded-2xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 active:scale-95 uppercase tracking-widest min-h-[54px]"
                        >
                            <Download size={18} strokeWidth={3} />
                            <span className="sm:hidden lg:inline">Export CSV</span>
                        </button>
                        <button
                            onClick={() => exportToPDF()}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-100 text-[#042f21] rounded-2xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 active:scale-95 uppercase tracking-widest min-h-[54px]"
                        >
                            <Download size={18} strokeWidth={3} />
                            <span className="sm:hidden lg:inline">Export PDF</span>
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#fa922c] text-white rounded-2xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest min-h-[54px] sm:col-span-1"
                        >
                            <Plus size={18} strokeWidth={4} />
                            Register Visitor
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-[#fa922c]" size={48} />
                    </div>
                ) : (
                    <div className="pb-10">
                        <DataTable columns={columns} data={visitors} />
                    </div>
                )}
            </div>

            <CreateInviteModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    fetchVisitors();
                }}
            />
        </div>
    );
}

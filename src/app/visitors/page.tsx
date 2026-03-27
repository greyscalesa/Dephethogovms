'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    Users,
    Search,
    Plus,
    X,
    Loader2,
    Calendar,
    Filter,
    Download,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToPDF } from '@/lib/utils';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: 'GUEST',
        hostId: 'u-4', // Mock default host
        siteId: 'site-1',
        companyId: 'comp-1'
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowModal(false);
                fetchVisitors();
            }
        } catch (err) {
            console.error(err);
        }
    };

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
            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Visitors Check-In</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Manage active onsite visits and guest entries.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => exportToCSV(visitors, 'vms_active_visitors')}
                            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 text-[#042f21] rounded-xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/40 active:scale-95 uppercase tracking-widest"
                        >
                            <Download size={18} strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => exportToPDF()}
                            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 text-[#042f21] rounded-xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/40 active:scale-95 uppercase tracking-widest"
                        >
                            <FileText size={18} strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#fa922c] text-white rounded-xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest"
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
                    <DataTable columns={columns} data={visitors} />
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-[#042f21]/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-11 overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Visitor Check-In</h2>
                                    <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                        <X size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                            <input
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Company Name</label>
                                            <input
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                                            <input
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Visitor Type</label>
                                            <select
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold appearance-none capitalize"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="GUEST">Guest</option>
                                                <option value="CONTRACTOR">Contractor</option>
                                                <option value="VENDOR">Vendor</option>
                                                <option value="DELIVERY">Delivery</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button className="w-full h-20 bg-[#fa922c] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#fa922c]/30 hover:bg-[#e07d20] active:scale-95 transition-all mt-4">
                                        Check-In Visitor
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

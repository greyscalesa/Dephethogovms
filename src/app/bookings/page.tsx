'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    Calendar,
    Plus,
    X,
    Loader2,
    CalendarCheck,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        visitorName: '',
        company: '',
        scheduledTime: '',
        siteId: 'site-1',
        hostId: 'u-4',
        type: 'GUEST'
    });

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            setBookings(data.map((b: any) => ({
                ...b,
                visitor: b.visitorName,
                checkIn: b.scheduledTime ? new Date(b.scheduledTime).toLocaleDateString() : 'Pending',
                host: 'David Smith', // Mock host for now
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ visitorName: '', company: '', scheduledTime: '', siteId: 'site-1', hostId: 'u-4', type: 'GUEST' });
                fetchBookings();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'Visitor', accessor: 'visitor' },
        { header: 'Type', accessor: 'type' },
        { header: 'Scheduled Date', accessor: 'checkIn' },
        { header: 'Host', accessor: 'host' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Reservations</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Manage pre-booked visits and screening.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-8 py-3.5 bg-[#fa922c] text-white rounded-xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest"
                    >
                        <CalendarCheck size={18} strokeWidth={4} />
                        Create Invite
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-[#fa922c]" size={48} />
                    </div>
                ) : (
                    <DataTable columns={columns} data={bookings} />
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
                                    <h2 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Create Invite</h2>
                                    <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                        <X size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Visitor Full Name</label>
                                            <input
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold"
                                                value={formData.visitorName}
                                                onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Arrival Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold"
                                                value={formData.scheduledTime}
                                                onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Select Site Location</label>
                                        <select
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold appearance-none"
                                            value={formData.siteId}
                                            onChange={e => setFormData({ ...formData, siteId: e.target.value })}
                                        >
                                            <option value="site-1">Main HQ</option>
                                            <option value="site-2">JHB Branch</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-20 bg-[#fa922c] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#fa922c]/30 hover:bg-[#e07d20] active:scale-95 transition-all mt-4"
                                    >
                                        Confirm Reservation
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


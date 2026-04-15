'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    X,
    Loader2,
    CalendarCheck,
    Download as DownloadIcon,
    Search,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '@/lib/utils';
import VisitorQR from '@/components/VisitorQR';
import CreateInviteModal from '@/components/CreateInviteModal';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [lastInvite, setLastInvite] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hosts, setHosts] = useState<any[]>([]);
    
    // Server-side state
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '10',
                search: debouncedSearch,
                status: status,
                sortBy: 'created_at',
                order: 'desc'
            });

            // Parallel fetching
            const [res, hostsRes] = await Promise.all([
                fetch(`/api/bookings?${params}`),
                fetch('/api/employees')
            ]);
            
            if (!res.ok) throw new Error('Failed to fetch bookings');
            if (!hostsRes.ok) throw new Error('Failed to fetch host list');

            const [result, hostsData] = await Promise.all([
                res.json(),
                hostsRes.json()
            ]);

            setHosts(hostsData);

            if (result.data) {
                setBookings(result.data.map((b: any) => ({
                    ...b,
                    visitor: b.visitorName,
                    checkIn: b.scheduledTime ? new Date(b.scheduledTime).toLocaleDateString() : 'Pending',
                    host: hostsData.find((h: any) => h.id === b.hostId)?.fullName || 'Alice Johnson', 
                })));
                setPagination(result.pagination);
            }
        } catch (err: any) {
            console.error('Failed to fetch bookings:', err);
            setError(err.message || 'An unexpected connection error occurred.');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, status]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleInviteSuccess = (visitor: any) => {
        setLastInvite(visitor);
        setShowModal(false);
        setShowSuccess(true);
        fetchBookings();
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({
                pageSize: '1000',
                search: debouncedSearch,
                status: status,
                sortBy: 'created_at',
                order: 'desc'
            });
            const res = await fetch(`/api/bookings?${params}`);
            const result = await res.json();
            if (result.data) {
                exportToCSV(result.data, 'vms_bookings_export');
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setIsExporting(false);
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-100 text-[#042f21] rounded-2xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 active:scale-95 uppercase tracking-widest min-h-[50px] disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <DownloadIcon size={18} strokeWidth={3} />}
                            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#fa922c] text-white rounded-xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest"
                        >
                            <CalendarCheck size={18} strokeWidth={4} />
                            Create Invite
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={3} />
                        <input 
                            type="text"
                            placeholder="SEARCH RESERVATIONS..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-[#042f21] focus:outline-none focus:ring-2 focus:ring-[#fa922c]/20 transition-all placeholder:text-slate-300 uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {['ALL', 'PRE_BOOKED', 'CHECKED_IN', 'CANCELLED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatus(s); setPage(1); }}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    status === s 
                                    ? 'bg-[#042f21] text-white shadow-lg shadow-[#042f21]/20' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                                }`}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="flex items-center gap-3 p-6 bg-rose-50 border border-rose-100 rounded-[32px] text-rose-600 shadow-xl shadow-rose-500/10">
                        <AlertCircle size={24} strokeWidth={3} />
                        <div>
                            <p className="text-sm font-black uppercase tracking-tighter">System Error</p>
                            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{error}</p>
                        </div>
                    </div>
                )}

                <DataTable 
                    columns={columns} 
                    data={bookings} 
                    isLoading={loading}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            </div>

            <CreateInviteModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                onSuccess={handleInviteSuccess} 
            />

            <AnimatePresence>
                {showSuccess && lastInvite && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowSuccess(false)}
                            className="absolute inset-0 bg-[#042f21]/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-11 overflow-hidden"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Invite Created</h2>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Successfully registered reservation</p>
                                    </div>
                                    <button onClick={() => setShowSuccess(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                        <X size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="bg-slate-50 rounded-[32px] p-2 mb-8">
                                    <VisitorQR 
                                        visitor={{
                                            id: lastInvite.id,
                                            name: lastInvite.name || lastInvite.visitorName,
                                            type: lastInvite.type,
                                            hostName: hosts.find((h: any) => h.id === lastInvite.hostId)?.fullName || 'Alice Johnson',
                                            siteId: lastInvite.siteId,
                                            companyId: 'comp-1',
                                            phone: lastInvite.phone || '',
                                            status: 'PENDING'
                                        } as any} 
                                        token={lastInvite.qrToken} 
                                    />
                                </div>

                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="w-full h-20 bg-[#042f21] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2XL hover:bg-black active:scale-95 transition-all"
                                >
                                    Close & Return
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

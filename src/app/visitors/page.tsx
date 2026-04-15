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
    Search,
    AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToPDF } from '@/lib/utils';
import CreateInviteModal from '@/components/CreateInviteModal';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
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
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const [error, setError] = useState<string | null>(null);

    const fetchVisitors = async () => {
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
            const res = await fetch(`/api/visitors?${params}`);
            if (!res.ok) throw new Error('Failed to fetch from server');
            const result = await res.json();
            
            if (result.data) {
                setVisitors(result.data.map((v: any) => ({
                    ...v,
                    visitor: v.name,
                    checkIn: v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
                    host: v.hostName || 'Default Host'
                })));
                setPagination(result.pagination);
            }
        } catch (err: any) {
            console.error('Failed to fetch visitors:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, [page, status, debouncedSearch]);

    const [isExporting, setIsExporting] = useState(false);

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({
                pageSize: '1000', // high limit for export
                search: debouncedSearch,
                status: status,
                sortBy: 'created_at',
                order: 'desc'
            });
            const res = await fetch(`/api/visitors?${params}`);
            const result = await res.json();
            if (result.data) {
                exportToCSV(result.data, 'vms_visitors_export');
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
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-100 text-[#042f21] rounded-2xl text-[12px] font-black hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 active:scale-95 uppercase tracking-widest min-h-[54px] disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={3} />}
                            <span className="sm:hidden lg:inline">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
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

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={3} />
                        <input 
                            type="text"
                            placeholder="SEARCH BY NAME, EMAIL, PHONE OR COMPANY..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-[#042f21] focus:outline-none focus:ring-2 focus:ring-[#fa922c]/20 transition-all placeholder:text-slate-300 uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {['ALL', 'PENDING', 'ON_SITE', 'CHECKED_OUT'].map((s) => (
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

                <div className="pb-10">
                    <DataTable 
                        columns={columns} 
                        data={visitors} 
                        isLoading={loading}
                        pagination={pagination}
                        onPageChange={setPage}
                    />
                </div>
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

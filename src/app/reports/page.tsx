'use client';

import React, { useState } from 'react';
import TopHeader from '@/components/TopHeader';
import {
    FileText,
    Filter,
    Download,
    Users,
    ArrowUpRight,
    Loader2,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { exportToCSV, exportToPDF } from '@/lib/utils';

export default function ReportsPage() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const res = await fetch('/api/visitors?pageSize=1000');
            const result = await res.json();
            if (result.data) {
                exportToCSV(result.data, 'vms_visitor_audit_report');
            }
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-6 md:p-8 space-y-10 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Audit & Reports</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Generate detailed insights and compliance logs.</p>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Date Range</label>
                        <select className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold appearance-none">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                            <option>Monthly Audit</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Site Location</label>
                        <select className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold appearance-none">
                            <option>All Locations</option>
                            <option>Main HQ</option>
                            <option>JHB Branch</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Report Type</label>
                        <select className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold appearance-none">
                            <option>Visitor Logs</option>
                            <option>Employee Attendance</option>
                            <option>Incident Reports</option>
                            <option>Compliance Audit</option>
                        </select>
                    </div>
                    <button className="h-14 bg-[#042f21] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#032319] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                        <Filter size={16} /> Filter Results
                    </button>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Visitor History', count: '1,240', info: 'Full onsite tracking logs', icon: Users },
                        { title: 'Emergency incidents', count: '3', info: 'Safety incidents recorded', icon: AlertCircle },
                        { title: 'Site Compliance', count: '98%', info: 'Safety & Policy alignment', icon: ShieldCheck },
                    ].map((card, i) => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={i}
                            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#fa922c]" />
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-[#fa922c]">
                                    <card.icon size={28} />
                                </div>
                                <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#042f21] transition-colors">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                            <h3 className="text-sm font-black text-[#042f21]/40 uppercase tracking-[0.2em]">{card.title}</h3>
                            <p className="text-4xl font-black text-[#042f21] mt-2 font-outfit">{card.count}</p>
                            <p className="text-xs font-bold text-[#042f21]/20 uppercase tracking-widest mt-4">{card.info}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Export Options */}
                <div className="bg-[#fa922c] p-10 rounded-[40px] shadow-2xl shadow-[#fa922c]/30 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-white">
                        <h2 className="text-3xl font-black tracking-tighter uppercase font-outfit">Ready to Export?</h2>
                        <p className="text-white/60 text-sm font-bold uppercase tracking-widest mt-2">Download your data in production-ready formats.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex items-center gap-3 px-8 py-5 bg-white text-[#fa922c] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            onClick={() => exportToPDF()}
                            className="flex items-center gap-3 px-8 py-5 bg-[#042f21] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#032319] transition-all active:scale-95 shadow-xl shadow-[#042f21]/20"
                        >
                            <FileText size={20} /> Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



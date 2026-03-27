'use client';

import React from 'react';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';
import {
    History,
    Search,
    Filter,
    Download,
    Calendar,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

const historyData = [
    { id: '1', visitor: 'Michael Smith', company: 'TechNova', type: 'CONTRACTOR', status: 'CHECKED_OUT', host: 'Alice Johnson', checkIn: '09:12 AM', checkOut: '11:45 AM' },
    { id: '2', visitor: 'Robert Fox', company: 'DesignCo', type: 'VENDOR', status: 'CHECKED_OUT', host: 'Charlie Brown', checkIn: '08:30 AM', checkOut: '11:00 AM' },
];

const columns = [
    { header: 'Visitor', accessor: 'visitor' },
    { header: 'Type', accessor: 'type' },
    { header: 'In Time', accessor: 'checkIn' },
    { header: 'Out Time', accessor: 'checkOut' },
    { header: 'Host', accessor: 'host' },
    { header: 'Status', accessor: 'status' },
];

export default function TransactionsPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-10 overflow-y-auto no-scrollbar pb-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black text-[#042f21] tracking-tighter uppercase font-outfit leading-tight md:leading-none">History Logs</h1>
                        <p className="text-[#042f21]/40 text-sm md:text-base font-bold tracking-tight uppercase">Audit logs of all visitor entries and exits.</p>
                    </div>
                    <button
                        onClick={() => exportToCSV(historyData, 'vms_transactions_log')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[#fa922c] text-white rounded-2xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest min-h-[54px]"
                    >
                        <Download size={18} strokeWidth={4} />
                        Export Audit Log
                    </button>
                </div>
                <DataTable columns={columns} data={historyData} />
            </div>
        </div>
    );
}


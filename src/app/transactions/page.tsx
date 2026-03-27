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
            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Check-in / Out Logs</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Audit logs of all visitor entries and exits.</p>
                    </div>
                    <button
                        onClick={() => exportToCSV(historyData, 'vms_transactions_log')}
                        className="flex items-center gap-2 px-6 py-3 bg-[#fa922c] text-white rounded-xl text-[12px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/20 active:scale-95 uppercase tracking-widest"
                    >
                        <Download size={18} strokeWidth={3} /> Export CSV
                    </button>
                </div>
                <DataTable columns={columns} data={historyData} />
            </div>
        </div>
    );
}


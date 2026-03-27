'use client';

import React from 'react';
import TopHeader from '@/components/TopHeader';
import {
    Users,
    Clock,
    Download,
    Search,
    UserCheck,
    UserX,
    Calendar,
    MoreVertical,
    CheckCircle2,
    XCircle,
    MinusCircle
} from 'lucide-react';

const stats = [
    { label: 'PRESENT TODAY', value: '142', icon: UserCheck, color: 'text-emerald-500', borderColor: 'border-l-emerald-500' },
    { label: 'ABSENT TODAY', value: '12', icon: UserX, color: 'text-rose-500', borderColor: 'border-l-rose-500' },
    { label: 'ON LEAVE', value: '8', icon: Clock, color: 'text-amber-500', borderColor: 'border-l-amber-500' },
];

const attendanceData = [
    { id: 1, name: 'Michael Chen', department: 'Engineering', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'PRESENT' },
    { id: 2, name: 'Sarah Adams', department: 'Human Resources', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'PRESENT' },
    { id: 3, name: 'James Wilson', department: 'Operations', checkIn: '-', checkOut: '-', status: 'ABSENT' },
    { id: 4, name: 'Thabo Mbeki', department: 'Security', checkIn: '06:00 AM', checkOut: '06:00 PM', status: 'PRESENT' },
    { id: 5, name: 'Linda Groenewald', department: 'Finance', checkIn: '-', checkOut: '-', status: 'LEAVE' },
    { id: 6, name: 'Kamohelo Moloi', department: 'IT Support', checkIn: '08:15 AM', checkOut: '04:45 PM', status: 'PRESENT' },
];

export default function AttendancePage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f8faf9]">
            <TopHeader />

            <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto no-scrollbar">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-3 font-outfit uppercase">Employee Attendance</h1>
                        <p className="text-slate-400 font-medium">Track employee clock-in and clock-out times accurately.</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest">
                        <Download size={18} className="text-slate-400" />
                        Export Log
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-white p-8 rounded-[32px] border border-slate-100 border-l-8 ${stat.borderColor} shadow-xl shadow-slate-200/40 flex items-center justify-between`}>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                <h3 className="text-4xl font-black text-slate-800 font-outfit">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Table Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col">
                    {/* Search & Filter Header */}
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-[#ff8c00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search attendance..."
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold text-slate-900 focus:ring-4 focus:ring-[#ff8c00]/5 focus:bg-white transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} />
                                Today: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                                    <th className="px-8 py-6 text-left">Employee</th>
                                    <th className="px-8 py-6 text-left">Department</th>
                                    <th className="px-8 py-6 text-left">Check-In</th>
                                    <th className="px-8 py-6 text-left">Check-Out</th>
                                    <th className="px-8 py-6 text-left">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendanceData.map((row) => (
                                    <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                                    {row.name.charAt(0)}
                                                </div>
                                                <span className="text-[15px] font-black text-slate-800">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-500">{row.department}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-sm font-bold ${row.checkIn === '-' ? 'text-slate-300' : 'text-slate-800'}`}>
                                                {row.checkIn}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-sm font-bold ${row.checkOut === '-' ? 'text-slate-300' : 'text-slate-800'}`}>
                                                {row.checkOut}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {attendanceData.length} entries</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">Prev</button>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-800 border-[#ff8c00]/30 transition-all uppercase tracking-widest">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PRESENT':
            return (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 w-fit">
                    <CheckCircle2 size={12} strokeWidth={3} />
                    Present
                </span>
            );
        case 'ABSENT':
            return (
                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1.5 w-fit">
                    <XCircle size={12} strokeWidth={3} />
                    Absent
                </span>
            );
        case 'LEAVE':
            return (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1.5 w-fit">
                    <MinusCircle size={12} strokeWidth={3} />
                    On Leave
                </span>
            );
        default:
            return null;
    }
}

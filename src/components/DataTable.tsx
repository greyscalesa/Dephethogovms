'use client';

import React from 'react';
import {
    ChevronRight,
    MoreVertical,
    Search,
    Filter,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    MoreHorizontal,
} from 'lucide-react';

interface Column {
    header: string;
    accessor: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
}

export default function DataTable({ columns, data }: DataTableProps) {
    return (
        <div className="w-full">
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {data.map((row, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative active:scale-[0.98] transition-transform">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#fa922c]/10 text-[#fa922c] flex items-center justify-center font-black text-sm">
                                    {row.visitor?.charAt(0) || row.name?.charAt(0) || 'V'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-black text-[#042f21] leading-tight truncate">{row.visitor || row.name}</p>
                                    <p className="text-[11px] font-bold text-[#042f21]/40 uppercase tracking-widest mt-0.5 truncate">{row.company}</p>
                                </div>
                            </div>
                            <button className="p-2 -mr-2 text-slate-400 hover:text-[#fa922c]">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                            {columns.filter(col => col.accessor !== 'visitor').map((column, colIdx) => {
                                const value = row[column.accessor];
                                return (
                                    <div key={colIdx} className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{column.header}</p>
                                        <div className="text-[13px] font-bold text-[#042f21] leading-tight break-words">
                                            {column.accessor === 'status' ? (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ring-1 ring-inset ${value === 'ON_SITE' ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/20' : 'bg-slate-50 text-slate-500 ring-slate-500/20'}`}>
                                                    {value.replace('_', ' ')}
                                                </span>
                                            ) : value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                {columns.map((column, idx) => (
                                    <th key={idx} className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                        {column.header}
                                    </th>
                                ))}
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    {columns.map((column, colIdx) => {
                                        const value = row[column.accessor];

                                        if (column.accessor === 'status') {
                                            return (
                                                <td key={colIdx} className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black ring-1 ring-inset ${value === 'ON_SITE' ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/20' :
                                                            value === 'CHECKED_OUT' ? 'bg-slate-50 text-slate-500 ring-slate-500/20' :
                                                                'bg-blue-50 text-blue-600 ring-blue-600/20'
                                                        }`}>
                                                        {value === 'ON_SITE' ? <CheckCircle2 size={12} strokeWidth={3} /> :
                                                            value === 'CHECKED_OUT' ? <Clock size={12} strokeWidth={3} /> :
                                                                <Calendar size={12} strokeWidth={3} />}
                                                        {value.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            );
                                        }

                                        if (column.accessor === 'visitor') {
                                            return (
                                                <td key={colIdx} className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xs shadow-sm group-hover:bg-[#fa922c]/10 group-hover:text-[#fa922c] transition-colors">
                                                            {value.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[14px] font-black text-slate-900 leading-tight truncate">{value}</p>
                                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{row.company}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        }

                                        return (
                                            <td key={colIdx} className="px-6 py-5 text-[14px] font-bold text-slate-600">
                                                {value}
                                            </td>
                                        );
                                    })}
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import {
    ChevronRight,
    Calendar,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    QrCode,
} from 'lucide-react';

interface Column {
    header: string;
    accessor: string;
}

interface PaginationData {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

interface DataTableProps<T> {
    columns: Column[];
    data: T[];
    pagination?: PaginationData;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, pagination, onPageChange, isLoading }: DataTableProps<T>) {
    return (
        <div className="w-full space-y-4">
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 h-40 animate-pulse" />
                    ))
                ) : data.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
                        <p className="font-black text-[#042f21] uppercase tracking-tighter">No records found</p>
                        <p className="text-[#042f21]/40 text-[10px] font-bold uppercase tracking-widest">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    data.map((row, idx) => (
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
                                <div className="flex items-center gap-2 -mr-2">
                                    {row.id && (
                                        <a 
                                            href={`/visitors/${row.id}/qr`}
                                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="View QR Code"
                                        >
                                            <QrCode size={20} />
                                        </a>
                                    )}
                                    <button className="p-2 text-slate-400 hover:text-[#fa922c]">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                                {columns.filter(col => col.accessor !== 'visitor').map((column, colIdx) => {
                                    const value = row[column.accessor];
                                    return (
                                        <div key={colIdx} className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{column.header}</p>
                                            <div className="text-[13px] font-bold text-[#042f21] leading-tight break-words">
                                                {column.accessor === 'status' ? (
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ring-1 ring-inset ${value === 'ON_SITE' ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/20' : 
                                                        value === 'CHECKED_OUT' ? 'bg-slate-50 text-slate-500 ring-slate-500/20' :
                                                        'bg-blue-50 text-blue-600 ring-blue-600/20'}`}>
                                                        {value.replace('_', ' ')}
                                                    </span>
                                                ) : value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
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
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={columns.length + 1} className="px-6 py-8">
                                            <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-20 text-center space-y-2">
                                        <p className="font-black text-[#042f21] text-xl uppercase tracking-tighter">No records found</p>
                                        <p className="text-[#042f21]/40 text-xs font-bold uppercase tracking-widest">Try adjusting your filters or search terms.</p>
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, idx) => (
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

                                            if (column.accessor === 'visitor' || column.accessor === 'visitorName') {
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
                                        <td className="px-6 py-5 text-right flex items-center justify-end gap-3">
                                            {row.id && (
                                                <a 
                                                    href={`/visitors/${row.id}/qr`}
                                                    className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 border border-transparent hover:border-emerald-100 shadow-sm"
                                                    title="Visitor QR Code"
                                                >
                                                    <QrCode size={18} strokeWidth={2.5} />
                                                </a>
                                            )}
                                            <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page <= 1 || isLoading}
                            className="p-2 rounded-xl border border-slate-100 text-[#042f21] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all font-black"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages || isLoading}
                            className="p-2 rounded-xl border border-slate-100 text-[#042f21] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all font-black"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-[#042f21]/40 uppercase tracking-widest">Page</p>
                        <p className="text-[13px] font-black text-[#042f21]">{pagination.page} <span className="text-[#042f21]/20 mx-1">/</span> {pagination.totalPages}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-black text-[#042f21]/40 uppercase tracking-widest">Total Records</p>
                        <p className="text-[13px] font-black text-[#042f21] tracking-tighter">{pagination.total.toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

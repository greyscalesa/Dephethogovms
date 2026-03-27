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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((column, idx) => (
                                <th key={idx} className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-right">
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
                                            <td key={colIdx} className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${value === 'ON_SITE' ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/20' :
                                                        value === 'CHECKED_OUT' ? 'bg-slate-50 text-slate-500 ring-slate-500/20' :
                                                            'bg-blue-50 text-blue-600 ring-blue-600/20'
                                                    }`}>
                                                    {value === 'ON_SITE' ? <CheckCircle2 size={12} /> :
                                                        value === 'CHECKED_OUT' ? <Clock size={12} /> :
                                                            <Calendar size={12} />}
                                                    {value.replace('_', ' ')}
                                                </span>
                                            </td>
                                        );
                                    }

                                    if (column.accessor === 'visitor') {
                                        return (
                                            <td key={colIdx} className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                                                        {value.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-tight">{value}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{row.company}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        )
                                    }

                                    return (
                                        <td key={colIdx} className="px-6 py-4 text-sm font-medium text-slate-600">
                                            {value}
                                        </td>
                                    );
                                })}
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import TopHeader from '@/components/TopHeader';
import {
    Building2,
    Users,
    ShieldCheck,
    Settings,
    Plus,
    ChevronRight,
    UserCheck,
    Globe,
    MoreVertical,
} from 'lucide-react';

const companies = [
    {
        id: 1,
        name: 'TechNova Solutions',
        visitors: 450,
        employees: 1200,
        status: 'ACTIVE',
        logo: 'TN',
        color: 'bg-blue-600',
        admin: 'Sarah Miller',
        domain: 'technova.com'
    },
    {
        id: 2,
        name: 'Global Financials Inc.',
        visitors: 890,
        employees: 3500,
        status: 'ACTIVE',
        logo: 'GF',
        color: 'bg-emerald-600',
        admin: 'Mark Davis',
        domain: 'globalfinancials.co.za'
    },
    {
        id: 3,
        name: 'Industrial Logistics Co.',
        visitors: 230,
        employees: 450,
        status: 'ACTIVE',
        logo: 'IL',
        color: 'bg-orange-600',
        admin: 'Bob Thompson',
        domain: 'indlog.com'
    },
    {
        id: 4,
        name: 'Creative Agency Africa',
        visitors: 120,
        employees: 85,
        status: 'SUSPENDED',
        logo: 'CA',
        color: 'bg-rose-600',
        admin: 'Zoe Vent',
        domain: 'creativeagency.africa'
    },
];

export default function CompaniesPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <TopHeader />

            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-outfit">Company Management</h1>
                        </div>
                        <p className="text-slate-500">Super Admin view of all active tenants on the Dephethogo Access platform.</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
                        <Plus size={18} strokeWidth={3} />
                        Onboard New Entity
                    </button>
                </div>

                {/* Company Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl ${company.color} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-current-20 group-hover:scale-110 transition-transform`}>
                                        {company.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Globe size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-500">{company.domain}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                    <Users size={18} className="text-blue-600 mb-1" />
                                    <span className="text-lg font-bold text-slate-900 leading-tight">{company.visitors}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visitors</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                    <UserCheck size={18} className="text-emerald-600 mb-1" />
                                    <span className="text-lg font-bold text-slate-900 leading-tight">{company.employees}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Staff</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                    <Settings size={18} className="text-purple-600 mb-1" />
                                    <span className="text-xs font-bold text-slate-900 leading-tight">Pro</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tier</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{company.status}</span>
                                </div>
                                <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    Manage Console
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

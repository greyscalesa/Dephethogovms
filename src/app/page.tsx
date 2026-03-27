'use client';

import React from 'react';
import TopHeader from '@/components/TopHeader';
import DashboardStats from '@/components/DashboardStats';
import VisitorChart from '@/components/VisitorChart';
import {
  Users,
  Calendar,
  Plus,
  Filter,
  Download,
  Scan,
  UserPlus,
  ArrowRight,
  MoreVertical,
  QrCode,
} from 'lucide-react';

const accessLogs = [
  { id: '1', visitor: 'Sarah Jenkins', site: 'Site 1', time: '3/3/2026, 10:07:58 PM', initials: 'SJ' },
  { id: '2', visitor: 'Robert Wilson', site: 'Site 2', time: '3/3/2026, 10:07:58 PM', initials: 'RW' },
  { id: '3', visitor: 'Michael Fox', site: 'Site 4', time: '3/3/2026, 9:07:58 PM', initials: 'MF' },
  { id: '4', visitor: 'Emma Miller', site: 'Site 1', time: '3/3/2026, 8:07:58 PM', initials: 'EM' },
];

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
      <TopHeader />

      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#042f21] tracking-tighter leading-none mb-2 font-outfit uppercase">Dashboard</h1>
            <p className="text-[#042f21]/40 text-sm font-bold tracking-tight">Welcome back to Dephethogo Access.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-[#ccdbd4] border border-[#ccdbd4] rounded-xl text-[13px] font-black text-[#042f21] hover:bg-[#b0c4ba] transition-all shadow-lg active:scale-95 uppercase tracking-widest">
              <QrCode size={18} strokeWidth={3} className="opacity-50" />
              Scan Code
            </button>
            <button className="flex items-center gap-2 px-8 py-3.5 bg-[#fa922c] text-white rounded-xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest">
              <Plus size={18} strokeWidth={4} />
              Create Invite
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          {/* Main Chart */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <VisitorChart />
          </div>

          {/* Access Logs Widget */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#042f21] font-outfit uppercase tracking-tighter">Active Access Logs</h3>
              <button className="text-[12px] font-black text-[#fa922c] hover:text-[#e07d20] transition-colors uppercase tracking-widest flex items-center gap-1.5 active:scale-95">
                View All Log <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-3 text-[10px] font-black text-[#042f21]/30 uppercase tracking-[0.2em] px-4 pb-2">
                <span>Visitor</span>
                <span>Site</span>
                <span className="text-right">Check-in Time</span>
              </div>
              {accessLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all group flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-3 items-center gap-4">
                    <div className="flex flex-col">
                      <p className="text-[15px] font-black text-[#042f21] leading-tight truncate">{log.visitor}</p>
                      <p className="text-[10px] font-bold text-[#042f21]/40 uppercase tracking-widest mt-1">Details &gt;</p>
                    </div>
                    <div className="text-[14px] font-bold text-[#042f21]/60">{log.site}</div>
                    <div className="text-[12px] font-bold text-[#042f21]/40 text-right leading-tight">
                      {log.time.split(',')[1]}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Evacuation List Action */}
            <button className="w-full py-5 mt-10 bg-[#042f21] text-white rounded-2xl font-black text-xs hover:bg-[#032319] transition-all uppercase tracking-widest shadow-lg shadow-[#042f21]/20 group flex items-center justify-center gap-3">
              <Users size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              View Evacuation List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

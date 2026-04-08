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
  MapPin,
  Building2,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react';
import { useSite } from '@/lib/context/SiteContext';
import SitesOverview from '@/components/SitesOverview';

export default function Dashboard() {
  const { selectedSiteId } = useSite();
  const [visitors, setVisitors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch(`/api/visitors?siteId=${selectedSiteId}`);
        const data = await res.json();
        setVisitors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, [selectedSiteId]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
      <TopHeader />

      <div className="flex-1 p-4 md:p-8 space-y-8 md:space-y-12 overflow-y-auto no-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#fa922c]" />
              <span className="text-[10px] font-black text-[#fa922c] uppercase tracking-[0.2em]">Operational Command</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#042f21] tracking-tighter leading-tight font-outfit uppercase">
              {selectedSiteId === 'all' ? 'Enterprise Dashboard' : 'Site Analytics'}
            </h1>
            <p className="text-[#042f21]/40 text-sm md:text-base font-bold tracking-tight">
              {selectedSiteId === 'all' ? 'Real-time visibility across all registered locations.' : `Managing operations for ${visitors[0]?.siteName || 'Site ' + selectedSiteId}.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#fa922c] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#fa922c]/20">
                    <LayoutGrid size={14} /> Card View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    <MapPin size={14} /> Map View
                </button>
            </div>
            <a href="/bookings?create=true" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#fa922c] text-white rounded-2xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest min-h-[54px]">
              <Plus size={18} strokeWidth={4} />
              New Invite
            </a>
          </div>
        </div>

        {/* Site Overview Section */}
        {selectedSiteId === 'all' && <SitesOverview />}

        {/* Stats Grid */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-stretch pb-10">
          {/* Main Chart */}
          <div className="lg:col-span-2 flex flex-col min-w-0">
            <VisitorChart />
          </div>

          {/* Access Logs Widget */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#042f21] font-outfit uppercase tracking-tighter">Active Access Logs</h3>
              <button className="text-[12px] font-black text-[#fa922c] hover:text-[#e07d20] transition-colors uppercase tracking-widest flex items-center gap-1.5 active:scale-95">
                View All <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4 md:space-y-6 flex-1">
              <div className="hidden md:grid grid-cols-3 text-[10px] font-black text-[#042f21]/30 uppercase tracking-[0.2em] px-4 pb-2 border-b border-slate-50">
                <span>Visitor</span>
                <span>Type</span>
                <span className="text-right">Time</span>
              </div>
              {visitors.slice(0, 5).map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/80 hover:border-[#fa922c]/30 transition-all group flex items-center justify-between cursor-pointer">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fa922c]/10 text-[#fa922c] flex items-center justify-center font-black text-sm">
                        {log.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-[15px] font-black text-[#042f21] leading-tight truncate">{log.name}</p>
                        <p className="text-[11px] font-bold text-[#042f21]/40 uppercase tracking-widest mt-1 md:hidden">{log.type} &bull; {log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : 'Pending'}</p>
                      </div>
                    </div>
                    <div className="hidden md:block text-[12px] font-black text-[#042f21]/40 uppercase tracking-widest leading-none">{log.type}</div>
                    <div className="hidden md:block text-[12px] font-bold text-[#042f21]/40 text-right leading-tight italic">
                      {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#fa922c] md:hidden shrink-0 ml-2" />
                </div>
              ))}
              {visitors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <AlertCircle size={40} strokeWidth={1} />
                    <p className="text-[11px] font-bold uppercase tracking-widest mt-4">No activity logged today</p>
                </div>
              )}
            </div>

            {/* Emergency Evacuation List Action */}
            <button className="w-full py-5 mt-8 md:mt-10 bg-[#042f21] text-white rounded-2xl font-black text-xs hover:bg-[#032319] transition-all uppercase tracking-widest shadow-lg shadow-[#042f21]/20 group flex items-center justify-center gap-3 min-h-[60px]">
              <Users size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              Evacuation List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

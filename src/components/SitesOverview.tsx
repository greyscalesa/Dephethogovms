'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    ArrowUpRight, 
    ShieldCheck, 
    Clock, 
    MapPin,
    AlertCircle
} from 'lucide-react';
import { useSite } from '@/lib/context/SiteContext';

interface SiteStats {
    totalVisitorsToday: number;
    onSiteCount: number;
    capacityStatus: number;
}

interface Site {
    id: string;
    name: string;
    code: string;
    address: string;
    status: 'ACTIVE' | 'OFFLINE' | 'INACTIVE';
    lastActivityAt?: string;
    stats: SiteStats;
}

export default function SitesOverview() {
    const { setSelectedSiteId } = useSite();
    const [sites, setSites] = React.useState<Site[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchSites = async () => {
        try {
            const res = await fetch('/api/sites');
            const data = await res.json();
            setSites(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSites();
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') fetchSites();
        }, 30000); // Polling every 30s only when active
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-[#042f21] font-outfit uppercase tracking-tighter">Operational Visibility</h2>
                    <p className="text-[#042f21]/40 text-[11px] font-bold uppercase tracking-widest mt-1">Multi-site performance & site health</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {sites.map((site) => (
                    <motion.div
                        key={site.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedSiteId(site.id)}
                        className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#fa922c]/10 hover:border-[#fa922c]/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Background Pulse for Active Sites */}
                        {site.status === 'ACTIVE' && (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-[#042f21] tracking-tight truncate">{site.name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin size={10} strokeWidth={3} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[140px]">{site.code} &bull; {site.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl space-y-1 group-hover:bg-[#fa922c]/5 transition-colors">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Today</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-[#042f21]">{site.stats.totalVisitorsToday}</span>
                                        <Users size={12} className="text-[#fa922c]" />
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl space-y-1 group-hover:bg-emerald-50 transition-colors">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">On-Site</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-emerald-600">{site.stats.onSiteCount}</span>
                                        <ShieldCheck size={12} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Capacity</span>
                                    <span className="text-[10px] font-black text-[#042f21]">{Math.round(site.stats.capacityStatus * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${site.stats.capacityStatus * 100}%` }}
                                        className={`h-full rounded-full ${site.stats.capacityStatus > 0.8 ? 'bg-rose-500' : site.stats.capacityStatus > 0.5 ? 'bg-amber-500' : 'bg-[#fa922c]'}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Last Active: {new Date(site.lastActivityAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#fa922c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

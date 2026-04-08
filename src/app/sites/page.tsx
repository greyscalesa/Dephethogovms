'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    MapPin, 
    Building2, 
    Shield, 
    Clock, 
    Users,
    Activity,
    ChevronRight,
    Loader2,
    X,
    LayoutGrid,
    Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '@/components/TopHeader';
import DataTable from '@/components/DataTable';

interface Site {
    id: string;
    name: string;
    code: string;
    address: string;
    status: 'ACTIVE' | 'OFFLINE';
    type: string;
    maxOccupancy: number;
    managerId: string;
    stats: {
        totalVisitorsToday: number;
        onSiteCount: number;
    }
}

export default function SitesPage() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'card' | 'map'>('card');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'OFFICE',
        address: '',
        operatingHours: '',
        maxOccupancy: 500
    });

    const fetchSites = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchSites();
    }, []);

    const filteredSites = sites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowCreateModal(false);
                setFormData({ name: '', type: 'OFFICE', address: '', operatingHours: '', maxOccupancy: 500 });
                fetchSites();
            } else {
                const errorData = await res.json();
                alert(`Site creation failed: ${errorData.error || 'Internal Server Error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('A network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            
            <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#fa922c]" />
                            <span className="text-[10px] font-black text-[#fa922c] uppercase tracking-[0.2em]">Infrastructure</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#042f21] tracking-tighter leading-tight font-outfit uppercase">Manage Sites</h1>
                        <p className="text-[#042f21]/40 text-sm md:text-base font-bold tracking-tight">Configure locations, security gates, and occupancy rules.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <button 
                                onClick={() => setViewMode('card')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-[#042f21] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={14} /> Grid
                            </button>
                            <button 
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-[#042f21] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Map size={14} /> Map
                            </button>
                        </div>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-8 py-4 bg-[#fa922c] text-white rounded-2xl text-[13px] font-black hover:bg-[#e07d20] transition-all shadow-xl shadow-[#fa922c]/30 active:scale-95 uppercase tracking-widest"
                        >
                            <Plus size={18} strokeWidth={4} />
                            Register Site
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#fa922c] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by site name, code or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#fa922c]/5 focus:border-[#fa922c]/20 transition-all font-bold text-slate-600"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#fa922c] mb-4" size={48} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Site Infrastructure...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                        {filteredSites.map((site) => (
                            <motion.div
                                key={site.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:border-[#fa922c]/20 transition-all"
                            >
                                <div className="p-8 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-[24px] bg-[#042f21] flex items-center justify-center text-white shadow-lg">
                                                <Building2 size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-[#042f21] tracking-tight">{site.name}</h3>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{site.code}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${site.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${site.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{site.status}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={16} className="text-slate-300 shrink-0 mt-1" />
                                            <p className="text-sm font-bold text-slate-600 leading-snug">{site.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-slate-300" />
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manager: <span className="text-[#042f21]">Alice Johnson</span></p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:bg-white transition-colors cursor-default">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Volume</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-[#fa922c]">{site.stats.totalVisitorsToday}</span>
                                                <span className="text-[10px] font-bold text-slate-400">Total</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:bg-white transition-colors cursor-default">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Occupancy</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-emerald-600">{site.stats.onSiteCount}</span>
                                                <span className="text-[10px] font-bold text-slate-400">/ {site.maxOccupancy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button className="flex-1 h-14 bg-slate-50 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#042f21] hover:text-white transition-all active:scale-95 group">
                                            Site Settings
                                        </button>
                                        <button className="h-14 px-6 bg-[#042f21] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#fa922c] transition-all active:scale-95">
                                            Launch <ChevronRight size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Site Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-[#042f21]/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative z-11 overflow-hidden"
                        >
                            <div className="p-10 md:p-14">
                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Register New Location</h2>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Expanding Enterprise Infrastructure</p>
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                        <X size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateSite} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Site Name</label>
                                            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold" placeholder="e.g. Pretoria Hub" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Site Type</label>
                                            <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold appearance-none uppercase tracking-tight">
                                                <option value="OFFICE">Corporate Office</option>
                                                <option value="WAREHOUSE">Industrial Warehouse</option>
                                                <option value="ESTATE">Residential Estate</option>
                                                <option value="EVENT">Event Venue</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Physical Address</label>
                                            <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold" placeholder="Full street address..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 md:col-span-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Operating Hours</label>
                                                <input required value={formData.operatingHours} onChange={e => setFormData({...formData, operatingHours: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold" placeholder="08:00 - 17:00" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Max Capacity</label>
                                                <input required type="number" value={formData.maxOccupancy} onChange={e => setFormData({...formData, maxOccupancy: parseInt(e.target.value) || 0})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#fa922c]/20 focus:border-[#fa922c] transition-all font-bold" placeholder="500" />
                                            </div>
                                        </div>
                                    </div>

                                    <button disabled={isSubmitting} type="submit" className="w-full h-20 bg-[#fa922c] text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#fa922c]/30 hover:bg-[#e07d20] active:scale-95 transition-all mt-6 disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Initialize Site'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

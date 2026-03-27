'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import {
    AlertTriangle,
    ShieldAlert,
    Radio,
    Bell,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [panicLoading, setPanicLoading] = useState(false);

    const fetchIncidents = async () => {
        const res = await fetch('/api/emergency');
        const data = await res.json();
        setIncidents(data);
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const triggerPanic = async (type: string) => {
        setPanicLoading(true);
        try {
            await fetch('/api/emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    location: 'Main Building - Site 1',
                    triggeredBy: 'Security Personnel'
                }),
            });
            fetchIncidents();
        } finally {
            setPanicLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f4f7f6]">
            <TopHeader />
            <div className="flex-1 p-6 md:p-8 space-y-10 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Emergency & Response</h1>
                        <p className="text-[#042f21]/40 text-sm font-bold tracking-tight uppercase">Instant alerts and incident logging for all sites.</p>
                    </div>
                </div>

                {/* Panic Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => triggerPanic('FIRE')}
                        className="bg-red-600 p-8 rounded-[32px] shadow-2xl shadow-red-500/30 flex flex-col items-center gap-6 group relative overflow-hidden h-64 justify-center"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                            <AlertTriangle size={40} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white uppercase tracking-widest">Trigger Fire Alarm</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => triggerPanic('SECURITY')}
                        className="bg-[#042f21] p-8 rounded-[32px] shadow-2xl shadow-[#042f21]/30 flex flex-col items-center gap-6 group relative overflow-hidden h-64 justify-center"
                    >
                        <div className="absolute inset-0 bg-[#fa922c]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 bg-[#fa922c] rounded-full flex items-center justify-center">
                            <ShieldAlert size={40} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white uppercase tracking-widest">Security Panic</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => triggerPanic('MEDICAL')}
                        className="bg-blue-600 p-8 rounded-[32px] shadow-2xl shadow-blue-500/30 flex flex-col items-center gap-6 group relative overflow-hidden h-64 justify-center"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <Radio size={40} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-white uppercase tracking-widest">Medical Support</span>
                    </motion.button>
                </div>

                {/* Incident Log */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-[#042f21] uppercase tracking-tighter font-outfit">Incident Log</h3>
                        <div className="flex items-center gap-2 text-[#042f21]/40 text-xs font-bold uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Live Monitoring
                        </div>
                    </div>

                    <div className="space-y-4">
                        {incidents.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px]">
                                No active incidents recorded
                            </div>
                        ) : (
                            incidents.map((inc) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    key={inc.id}
                                    className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${inc.type === 'FIRE' ? 'bg-red-500' : inc.type === 'SECURITY' ? 'bg-[#042f21]' : 'bg-blue-500'
                                            }`}>
                                            {inc.type === 'FIRE' ? <AlertTriangle size={24} /> : inc.type === 'SECURITY' ? <ShieldAlert size={24} /> : <Radio size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-[#042f21] leading-none">{inc.type} ALERT TRIGGERED</p>
                                            <p className="text-xs text-[#042f21]/40 font-bold uppercase tracking-widest mt-2">{inc.location} • {new Date(inc.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest">
                                            Active Resolve
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Camera, ChevronLeft, ShieldCheck, UserCheck2, History } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Scanner = dynamic(() => import('@/components/Scanner'), { 
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/90 flex items-center justify-center text-white font-black tracking-widest animate-pulse">INITIALIZING GATEWAY...</div>
});

export default function ScannerPage() {
    const [showScanner, setShowScanner] = useState(false);
    const [recentScans, setRecentScans] = useState<any[]>([]);

    const handleOnScan = async (token: string) => {
        try {
            const response = await fetch('/api/validate-checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await response.json();
            
            if (data.success) {
                setRecentScans(prev => [
                    { id: Date.now(), name: data.visitorName, time: new Date().toLocaleTimeString(), status: 'SUCCESS' },
                    ...prev.slice(0, 4)
                ]);
            } else {
                setRecentScans(prev => [
                    { id: Date.now(), name: data.error || 'Invalid QR', time: new Date().toLocaleTimeString(), status: 'ERROR' },
                    ...prev.slice(0, 4)
                ]);
            }
            
            return data;
        } catch (error) {
            console.error('Scan API error:', error);
            return { success: false, error: 'Internal Server Error' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12">
            {/* Context Navigation */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-12">
                <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Security Gateway</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-2xl text-center flex flex-col items-center">
                <div className="mb-8 p-6 bg-white/50 backdrop-blur-md rounded-[48px] border border-white/80 shadow-2xl shadow-slate-200/50">
                    <div className="p-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[32px] text-white shadow-xl shadow-emerald-500/20">
                        <Camera className="w-16 h-16 mb-6 mx-auto opacity-90" />
                        <h1 className="text-4xl font-black mb-3 tracking-tight">QR Scanner</h1>
                        <p className="text-emerald-50/70 font-medium max-w-md mx-auto leading-relaxed">
                            Position yourself as the master of the gate. Use this secure terminal to grant access to pre-booked visitors.
                        </p>
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowScanner(true)}
                    className="group relative w-full p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden shadow-2xl shadow-slate-900/40 hover:shadow-emerald-500/20 transition-all"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <Camera className="w-8 h-8" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">ACTIVATE SECURITY SCANNER</span>
                    </div>
                </motion.button>

                {/* Performance Tip: Lazy load scanner */}
                {showScanner && (
                    <Scanner
                        onScan={handleOnScan}
                        onClose={() => setShowScanner(false)}
                    />
                )}

                {/* Activity Feed */}
                <div className="mt-16 w-full text-left">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                                <History className="w-5 h-5 text-slate-400" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Scans</h2>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full tracking-widest uppercase">Live Activity</span>
                    </div>

                    <div className="space-y-4">
                        {recentScans.length === 0 ? (
                            <div className="p-12 bg-white rounded-3xl border border-dotted border-slate-200 text-center">
                                <UserCheck2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium text-sm">No recent scans recorded today.</p>
                            </div>
                        ) : (
                            recentScans.map((scan) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={scan.id}
                                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            scan.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                                        }`}>
                                            <UserCheck2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{scan.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{scan.time}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
                                        scan.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {scan.status}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-24 text-[10px] font-bold text-slate-300 tracking-[0.5em] uppercase">Dephethogo Industrial Secure X-001</div>
        </div>
    );
}

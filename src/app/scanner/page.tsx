'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import {
    Scan,
    Keyboard,
    Camera,
    Flashlight,
    RefreshCw,
    History,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScannerPage() {
    const [isScanning, setIsScanning] = useState(true);
    const [scanResult, setScanResult] = useState<any>(null);
    const [manualCode, setManualCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const simulateScan = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setScanResult({
                visitor: 'Michael J. Fox',
                company: 'Hill Valley Corp',
                type: 'CONTRACTOR',
                host: 'Biff Tannen',
                time: '11:45 AM',
                status: 'AUTHORIZED',
                photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop',
            });
            setIsProcessing(false);
            setIsScanning(false);
        }, 1500);
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
        setManualCode('');
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <TopHeader />

            <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Scanner Preview */}
                    <div className="relative group">
                        {/* Corner Borders */}
                        <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl z-20" />
                        <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl z-20" />
                        <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl z-20" />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-blue-600 rounded-br-2xl z-20" />

                        <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-500/10">
                            {isScanning ? (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                        <Camera size={64} className="opacity-20 animate-pulse" />
                                    </div>

                                    {/* Scanning Animation */}
                                    <motion.div
                                        initial={{ top: '0%' }}
                                        animate={{ top: '100%' }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />

                                    {/* Mock Camera View */}
                                    <div className="absolute inset-0 bg-slate-800/10 flex flex-col items-center justify-center p-12 text-center">
                                        <p className="text-white/60 text-sm font-medium mb-4">Center QR code within the frame</p>
                                        <button
                                            onClick={simulateScan}
                                            disabled={isProcessing}
                                            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Processing...' : 'Simulate QR Detection'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-emerald-500 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"
                                    >
                                        <CheckCircle2 size={48} strokeWidth={3} />
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button className="p-3 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 transition-colors shadow-sm">
                                <Flashlight size={20} />
                            </button>
                            <button className="p-3 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 transition-colors shadow-sm" onClick={resetScanner}>
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Scan Details / Manual Entry */}
                    <div className="space-y-8">
                        <AnimatePresence mode="wait">
                            {scanResult ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <img src={scanResult.photo} alt={scanResult.visitor} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-900">{scanResult.visitor}</h3>
                                            <p className="text-slate-500 font-medium">{scanResult.company}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold ring-1 ring-emerald-200">
                                            AUTHORIZED
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Visitor Type</p>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <User size={16} className="text-blue-600" />
                                                {scanResult.type}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Host</p>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-purple-600" />
                                                {scanResult.host}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time</p>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <Clock size={16} className="text-orange-600" />
                                                {scanResult.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={resetScanner}
                                            className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Confirm Check-in
                                        </button>
                                        <button
                                            onClick={resetScanner}
                                            className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="entry"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">Ready to Scan</h2>
                                        <p className="text-slate-500 mt-2 leading-relaxed">
                                            Point the camera at the visitor's QR code or enter the check-in code manually below.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Keyboard size={18} className="text-blue-600" />
                                            Manual Entry Code
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={manualCode}
                                                onChange={(e) => setManualCode(e.target.value)}
                                                placeholder="ENTER-CODE-123"
                                                className="flex-1 h-14 px-5 bg-white border border-slate-200 rounded-2xl text-lg font-mono font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all uppercase tracking-widest outline-none"
                                            />
                                            <button
                                                onClick={simulateScan}
                                                className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                                            >
                                                Search
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">P{i}</div>
                                            ))}
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                            Recent successful <br /> scans today
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}

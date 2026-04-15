'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
    success: boolean;
    message?: string;
    error?: string;
    visitorName?: string;
}

interface ScannerProps {
    onScan: (token: string) => Promise<ScanResult>;
    onClose: () => void;
}

export default function Scanner({ onScan, onClose }: ScannerProps) {
    const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkinStatus, setCheckinStatus] = useState<{
        success: boolean;
        message: string;
        visitorName?: string;
    } | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = useCallback(async (token: string) => {
        if (!isScanning) return;
        
        setIsScanning(false); // Pause scanning
        
        try {
            const response = await onScan(token);
            setCheckinStatus({
                success: response.success,
                message: (response.success ? response.message : response.error) || '',
                visitorName: response.visitorName
            });
            
            // Resume scanning after 3 seconds if needed, or close
            if (response.success) {
                setTimeout(() => {
                    onClose();
                }, 2500);
            } else {
                setTimeout(() => {
                    setCheckinStatus(null);
                    setIsScanning(true);
                }, 3000);
            }
        } catch (err: unknown) {
            const errorMsg = (err as Error).message || 'Connection error during check-in.';
            setCheckinStatus({
                success: false,
                message: errorMsg
            });
            setTimeout(() => {
                setCheckinStatus(null);
                setIsScanning(true);
            }, 3000);
        }
    }, [isScanning, onScan, onClose]);

    useEffect(() => {
        const qrScannerId = "qr-reader";
        const newScanner = new Html5Qrcode(qrScannerId);
        setScanner(newScanner);

        const startScanner = async () => {
            try {
                // Request permissions and start
                await newScanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        handleScan(decodedText);
                    },
                    () => {
                        // QR Code not found in this frame - ignore
                    }
                );
                setIsLoading(false);
                setError(null);
                setIsScanning(true);
            } catch (err: unknown) {
                const errStr = String(err);
                console.error("Scanner start error:", err);
                setIsLoading(false);
                if (errStr.includes("NotAllowedError")) {
                    setError("Camera access denied. Please enable camera permissions in your browser.");
                } else {
                    setError("Could not start camera. Make sure no other app is using it.");
                }
            }
        };

        const timer = setTimeout(startScanner, 500);

        return () => {
            clearTimeout(timer);
            if (newScanner.isScanning) {
                newScanner.stop().catch(e => console.error("Error stopping scanner:", e));
            }
        };
    }, [handleScan]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-lg leading-tight uppercase tracking-widest">Scanner</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-emerald-500/80 text-xs font-medium uppercase tracking-tighter">Live System</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Scanner Area */}
            <div className="relative w-full max-w-sm aspect-square px-6">
                <div id="qr-reader" className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20" />
                
                {/* Custom Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className={`w-64 h-64 border-2 rounded-3xl transition-colors duration-500 ${
                        checkinStatus ? (checkinStatus.success ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10') : 'border-white/30'
                    }`}>
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl transition-all" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl transition-all" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl transition-all" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl transition-all" />
                        
                        {/* Scanning Line */}
                        {!checkinStatus && (
                            <motion.div 
                                animate={{ top: ["5%", "95%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute left-4 right-4 h-0.5 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                            />
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
                        <RefreshCw className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            {/* Status Feedback */}
            <div className="mt-12 px-8 w-full max-w-md">
                <AnimatePresence mode="wait">
                    {checkinStatus ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-6 rounded-2xl flex flex-col items-center text-center gap-4 ${
                                checkinStatus.success ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'
                            }`}
                        >
                            {checkinStatus.success ? (
                                <div className="p-3 bg-emerald-500 rounded-full">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                            ) : (
                                <div className="p-3 bg-rose-500 rounded-full">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                </div>
                            )}
                            <div>
                                <h3 className={`text-xl font-bold ${checkinStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {checkinStatus.success ? 'Check-in Successful' : 'Check-in Failed'}
                                </h3>
                                <p className="text-white/70 mt-1">{checkinStatus.message}</p>
                                {checkinStatus.visitorName && (
                                    <p className="text-white text-lg font-semibold mt-2">{checkinStatus.visitorName}</p>
                                )}
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col items-center text-center gap-3"
                        >
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                            <p className="text-white/90">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
                            >
                                Retry
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <p className="text-white/50 animate-pulse text-sm font-medium tracking-[0.2em] uppercase">Align QR code within frame</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="absolute bottom-8 text-white/20 text-[10px] uppercase tracking-[0.4em] font-medium">DEPHE-SCAN PRO X26</div>
        </div>
    );
}

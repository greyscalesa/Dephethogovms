'use client';

import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download, Printer, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Visitor } from '@/lib/types';
import { format } from 'date-fns';

interface VisitorQRProps {
    visitor: Visitor;
    token: string;
}

export default function VisitorQR({ visitor, token }: VisitorQRProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        // If deployed, this generates a real link. Since it's a demo, use origin
        const passLink = `${window.location.origin}/visitors/${visitor.id}/qr?token=${token}`;
        const shareData = {
            title: 'Dephethogo Visitor Pass',
            text: `Hi ${visitor.name},\n\nHere is your verified visitor access pass for Dephethogo (Secure Gate Token 0x829).\n\nPlease present the following access token or QR code at security reception:\nToken: ${token}\n\n`,
            url: passLink,
        };

        try {
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback to mailto
                window.location.href = `mailto:?subject=Your Dephethogo Visitor Pass&body=${encodeURIComponent(shareData.text + '\n\nAccess Link: ' + shareData.url)}`;
            }
        } catch (err) {
            console.error('Error sharing', err);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const svg = qrRef.current?.querySelector('svg');
            if (!svg) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = 1024;
                canvas.height = 1024;
                
                if (ctx) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 64, 64, 896, 896);
                }
                
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `visitor-pass-${visitor.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
                setDownloading(false);
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        } catch (err) {
            console.error('Download failed:', err);
            setDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Visual Header */}
            <div className="w-full mb-8 flex flex-col items-center text-center gap-2">
                <div className="w-20 h-1 bg-emerald-500/30 rounded-full mb-2"></div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Access Pass</h1>
                <p className="text-slate-500 font-medium tracking-widest text-[10px] uppercase">Secure Gate Token 0x829</p>
            </div>

            {/* Premium Card Container */}
            <div className="relative w-full max-w-sm group">
                {/* Background Glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 via-blue-500/10 to-emerald-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                
                <div className="relative bg-white rounded-[32px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Top Section: Visitor Info */}
                    <div className="bg-slate-50 p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visitor Name</p>
                                <h3 className="text-xl font-bold text-slate-800">{visitor.name}</h3>
                            </div>
                            <div className="px-3 py-1 bg-white border border-emerald-100 rounded-full flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Valid</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Host</p>
                                <p className="text-xs font-semibold text-slate-600">{visitor.hostName || 'Front Desk'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-tighter">{visitor.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* QR Section */}
                    <div className="p-10 flex flex-col items-center justify-center bg-white border-y border-dashed border-slate-200" ref={qrRef}>
                        <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                            <QRCodeSVG 
                                value={token}
                                size={200}
                                level="H"
                                includeMargin={true}
                                className="drop-shadow-sm"
                            />
                        </div>
                        <p className="mt-8 text-[10px] font-mono text-slate-400 break-all max-w-[180px] text-center leading-relaxed">
                            {token.substring(0, 12)}...{token.substring(token.length - 12)}
                        </p>
                    </div>

                    {/* Bottom Section: Footer */}
                    <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">Expires In</span>
                            <span className="text-xs font-mono font-medium">29m 42s</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">Gate Code</span>
                            <span className="text-xs font-mono font-medium">#DEP-6721</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-3 px-6 py-3 bg-[#fa922c] border border-[#fa922c] rounded-2xl text-sm font-bold text-white hover:bg-[#e07d20] hover:border-[#e07d20] transition-all active:scale-95 shadow-md shadow-[#fa922c]/20"
                >
                    <Share2 className="w-4 h-4" />
                    Send Invite
                </button>
                
                <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-emerald-500" />}
                    Download PNG
                </button>
                
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    <Printer className="w-4 h-4 text-blue-500" />
                    Print ID Badge
                </button>

                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Copied!
                            </motion.div>
                        ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                                <Copy className="w-4 h-4 text-slate-400" />
                                Copy Token
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm w-full">
                <div className="flex gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Security Notice</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            This QR code is valid for a single entry only. Please present this to the security checkpoint upon arrival.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Hidden Print Styling */}
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
                }
            `}</style>
        </div>
    );
}

function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
        </svg>
    );
}

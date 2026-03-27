import React from 'react';

export default function Logo({ dark = false }: { dark?: boolean }) {
    return (
        <div className="flex items-center gap-2.5 max-w-full overflow-hidden">
            {/* Oval Icon with Gothic D - Scaled Down */}
            <div className="relative w-14 h-9 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#e65100] via-[#ffd700] to-[#e65100] rounded-[50%] shadow-xl flex items-center justify-center border border-white/20 overflow-hidden">
                    <span className="text-[#13604d] font-black text-lg italic tracking-tighter drop-shadow-[0_1.5px_0.5px_rgba(255,255,255,0.7)]" style={{ fontFamily: "'Old English Text MT', serif" }}>
                        D
                    </span>
                    {/* Inner sheen effect */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 blur-[1px]" />
                </div>
            </div>

            {/* Text Group - Scaled Down */}
            <div className="flex flex-col min-w-0">
                <span className={`${dark ? 'text-[#042f21]' : 'text-white'} font-serif italic font-bold text-lg tracking-tight leading-none drop-shadow-sm`}>
                    dephethogo
                </span>
                <span className="text-[#ff8c00] font-black text-[9px] uppercase tracking-[0.2em] mt-0.5 drop-shadow-md">
                    ACCESS
                </span>
            </div>
        </div>
    );
}

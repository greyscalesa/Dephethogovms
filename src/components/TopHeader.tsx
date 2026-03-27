'use client';

import React from 'react';
import {
    Bell,
    Search,
    Settings,
    LogOut,
    ChevronDown,
    HelpCircle,
} from 'lucide-react';

export default function TopHeader() {
    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-[#ccdbd4]/20 px-6 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative hidden md:block group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#042f21]/30 w-5 h-5 group-hover:text-[#fa922c] transition-colors" />
                <input
                    type="text"
                    placeholder="Search visitors, hosts, companies..."
                    className="w-full h-10 pl-14 pr-6 bg-[#ccdbd4]/10 border-none rounded-xl text-[14px] font-bold text-[#042f21] focus:ring-4 focus:ring-[#fa922c]/5 placeholder-[#042f21]/30 transition-all outline-none"
                />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-6">
                {/* Help Center */}
                <button className="flex items-center justify-center p-3 text-[#042f21]/40 hover:text-[#fa922c] transition-colors bg-[#ccdbd4]/10 rounded-xl">
                    <HelpCircle size={22} />
                </button>

                {/* Notifications */}
                <button className="flex items-center justify-center p-3 text-[#042f21]/40 hover:text-[#fa922c] transition-colors bg-[#ccdbd4]/10 rounded-xl relative">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-4 border-white" />
                </button>

                {/* Vertical Divider */}
                <div className="w-[1.5px] h-8 bg-[#ccdbd4]/20 mx-2" />

                {/* User Dropdown */}
                <button className="flex items-center gap-4 pl-3 pr-2 py-1.5 rounded-2xl hover:bg-[#ccdbd4]/10 transition-colors group">
                    <div className="flex flex-col items-end text-right hidden sm:flex">
                        <span className="text-[15px] font-black text-[#042f21] leading-tight">Admin Demo</span>
                        <span className="text-[12px] font-bold text-[#042f21]/40 uppercase tracking-widest mt-0.5">Super Admin</span>
                    </div>
                    <div className="w-12 h-12 bg-[#fa922c] rounded-2xl flex items-center justify-center text-white text-md font-black shadow-lg shadow-[#fa922c]/20 group-hover:scale-105 transition-transform">
                        S.A
                    </div>
                    <ChevronDown size={16} className="text-[#042f21]/20 group-hover:text-[#fa922c] transition-colors" />
                </button>
            </div>
        </header>
    );
}

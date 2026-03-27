'use client';

import React from 'react';
import {
    Bell,
    Search,
    ChevronDown,
    HelpCircle,
    Menu,
} from 'lucide-react';
import { useLayout } from '@/lib/LayoutContext';
import Logo from '@/components/Logo';

export default function TopHeader() {
    const { toggleSidebar } = useLayout();

    return (
        <header className="sticky top-0 z-40 w-full h-16 lg:h-20 bg-white border-b border-[#ccdbd4]/20 px-4 md:px-8 flex items-center justify-between">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-[#042f21] hover:bg-[#ccdbd4]/10 rounded-xl transition-colors"
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>
                <div className="scale-75 origin-left">
                    <Logo dark />
                </div>
            </div>

            {/* Desktop: Search Bar */}
            <div className="flex-1 max-w-md relative hidden lg:block group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#042f21]/30 w-5 h-5 group-hover:text-[#fa922c] transition-colors" />
                <input
                    type="text"
                    placeholder="Search visitors, hosts, companies..."
                    className="w-full h-12 pl-14 pr-6 bg-[#ccdbd4]/10 border-none rounded-2xl text-[14px] font-bold text-[#042f21] focus:ring-4 focus:ring-[#fa922c]/5 placeholder-[#042f21]/30 transition-all outline-none"
                    style={{ fontSize: '16px' }} // Ensure no zoom on iOS
                />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-6">
                {/* Search Toggle (Mobile/Tablet) */}
                <button className="lg:hidden flex items-center justify-center p-2.5 md:p-3 text-[#042f21]/40 hover:text-[#fa922c] transition-colors bg-[#ccdbd4]/10 rounded-xl">
                    <Search size={20} />
                </button>

                {/* Help Center (Desktop only) */}
                <button className="hidden md:flex items-center justify-center p-3 text-[#042f21]/40 hover:text-[#fa922c] transition-colors bg-[#ccdbd4]/10 rounded-xl">
                    <HelpCircle size={22} />
                </button>

                {/* Notifications */}
                <button className="flex items-center justify-center p-2.5 md:p-3 text-[#042f21]/40 hover:text-[#fa922c] transition-colors bg-[#ccdbd4]/10 rounded-xl relative">
                    <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                    <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-[1.5px] h-8 bg-[#ccdbd4]/20 mx-1 md:mx-2" />

                {/* User Dropdown */}
                <button className="flex items-center gap-2 md:gap-4 pl-1 md:pl-3 pr-1 md:pr-2 py-1 md:py-1.5 rounded-2xl md:hover:bg-[#ccdbd4]/10 transition-colors group">
                    <div className="flex flex-col items-end text-right hidden lg:flex">
                        <span className="text-[15px] font-black text-[#042f21] leading-tight">Admin Demo</span>
                        <span className="text-[12px] font-bold text-[#042f21]/40 uppercase tracking-widest mt-0.5">Super Admin</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fa922c] rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xs md:text-md font-black shadow-lg shadow-[#fa922c]/20 group-hover:scale-105 transition-transform">
                        S.A
                    </div>
                    <ChevronDown size={14} className="text-[#042f21]/20 group-hover:text-[#fa922c] transition-colors hidden sm:block" />
                </button>
            </div>
        </header>
    );
}

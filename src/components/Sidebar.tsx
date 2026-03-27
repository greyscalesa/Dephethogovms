'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Users,
    Scan,
    LogOut,
    Calendar,
    Building2,
    FileText,
    Search,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Briefcase,
    AlertTriangle,
    History,
    LayoutGrid,
    MapPin,
    Send,
    QrCode,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Logo from '@/components/Logo';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) setUser(data.user);
            });
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    if (pathname === '/login') return null;

    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', href: '/', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SECURITY', 'EMPLOYEE'] },
        { icon: QrCode, label: 'Scanner', href: '/scanner', roles: ['SUPER_ADMIN', 'SECURITY'] },
        { icon: Users, label: 'Visitors', href: '/visitors', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SECURITY', 'EMPLOYEE'] },
        { icon: History, label: 'Access Log', href: '/transactions', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SECURITY'] },
        { icon: Send, label: 'Invitations', href: '/bookings', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE'] },
        { icon: Clock, label: 'Attendance', href: '/attendance', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE'] },
        { icon: MapPin, label: 'Manage Sites', href: '/sites', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: Briefcase, label: 'Employees', href: '/employees', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: Building2, label: 'Companies', href: '/companies', roles: ['SUPER_ADMIN'] },
        { icon: FileText, label: 'Reports', href: '/reports', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: ShieldCheck, label: 'Security', href: '/security', roles: ['SUPER_ADMIN', 'SECURITY'] },
        { icon: AlertTriangle, label: 'Emergency', href: '/emergency', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SECURITY'] },
        { icon: Settings, label: 'Settings', href: '/settings', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
    ];

    const filteredItems = navItems.filter(item =>
        !user || item.roles.includes(user.role)
    );

    return (
        <div className={cn(
            "h-screen bg-[#042f21] border-r border-[#0a3f2d] transition-all duration-300 flex flex-col sticky top-0 left-0 z-50",
            isCollapsed ? "w-20" : "w-[240px]"
        )}>
            {/* Brand Logo - Official Dephethogo */}
            <div className="p-6 pb-8">
                <div className="flex items-center">
                    {isCollapsed ? (
                        <div className="w-12 h-12 bg-[#fa922c] rounded-xl flex items-center justify-center text-white font-black italic text-2xl shadow-lg ring-2 ring-white/10 shrink-0">
                            D
                        </div>
                    ) : (
                        <Logo />
                    )}
                </div>
                <div className="mt-8 h-px bg-[#0a3f2d] w-full" />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar pt-2">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative font-bold",
                                isActive
                                    ? "bg-[#fa922c] text-white shadow-xl shadow-[#fa922c]/20"
                                    : "text-[#ccdbd4] hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={18} className={cn(
                                "shrink-0 transition-transform",
                                isActive ? "text-white" : "text-[#ccdbd4] group-hover:text-white"
                            )} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap text-[14px] opacity-90 uppercase tracking-widest"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mx-8 mb-4 p-2 bg-[#0a3f2d] rounded-lg text-[#ccdbd4] hover:text-white flex items-center justify-center transition-all"
            >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Footer / User Profile */}
            <div className="p-4 bg-[#032319] border-t border-[#0a3f2d] flex flex-col gap-4">
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                    !isCollapsed ? "bg-transparent" : "bg-transparent"
                )}>
                    <div className="w-12 h-12 rounded-xl bg-[#fa922c] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg capitalize">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-black text-white truncate leading-none">{user?.fullName || 'Loading...'}</p>
                            <p className="text-[12px] font-bold text-[#ccdbd4]/60 truncate mt-1.5">{user?.role?.replace('_', ' ') || 'User'}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#ccdbd4] hover:bg-white/5 hover:text-white transition-all font-bold text-sm w-full group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}


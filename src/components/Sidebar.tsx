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

import { useLayout } from '@/lib/LayoutContext';
import { X } from 'lucide-react';

export default function Sidebar() {
    const { isSidebarOpen, setIsSidebarOpen } = useLayout();
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
        { icon: MapPin, label: 'Manage Sites', href: '/sites', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: Briefcase, label: 'Employees', href: '/employees', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: Clock, label: 'Attendance', href: '/attendance', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE'] },
        { icon: Building2, label: 'Companies', href: '/companies', roles: ['SUPER_ADMIN'] },
        { icon: FileText, label: 'Reports', href: '/reports', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { icon: ShieldCheck, label: 'Security', href: '/security', roles: ['SUPER_ADMIN', 'SECURITY'] },
        { icon: AlertTriangle, label: 'Emergency', href: '/emergency', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SECURITY'] },
        { icon: Settings, label: 'Settings', href: '/settings', roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
    ];

    const filteredItems = navItems.filter(item =>
        !user || item.roles.includes(user.role)
    );

    const sidebarContent = (
        <div className={cn(
            "h-full flex flex-col",
            isCollapsed ? "w-20" : "w-[260px]"
        )}>
            {/* Brand Logo - Official Dephethogo */}
            <div className="p-6 pb-8 flex items-center justify-between lg:block">
                <div className="flex items-center">
                    {isCollapsed ? (
                        <div className="w-12 h-12 bg-[#fa922c] rounded-xl flex items-center justify-center text-white font-black italic text-2xl shadow-lg ring-2 ring-white/10 shrink-0">
                            D
                        </div>
                    ) : (
                        <Logo />
                    )}
                </div>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-[#ccdbd4] hover:text-white lg:hidden"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="px-6 lg:mt-0">
                <div className="h-px bg-[#0a3f2d] w-full" />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar pt-6">
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
                            {(!isCollapsed || isSidebarOpen) && (
                                <span className="whitespace-nowrap text-[14px] opacity-90 uppercase tracking-widest">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle (LG only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mx-8 mb-4 p-2 bg-[#0a3f2d] rounded-lg text-[#ccdbd4] hover:text-white items-center justify-center transition-all hidden lg:flex"
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
                    {(!isCollapsed || isSidebarOpen) && (
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
                    {(!isCollapsed || isSidebarOpen) && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex h-screen bg-[#042f21] border-r border-[#0a3f2d] transition-all duration-300 flex-col sticky top-0 left-0 z-50",
                isCollapsed ? "w-20" : "w-[260px]"
            )}>
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[280px] bg-[#042f21] shadow-2xl border-r border-[#0a3f2d]"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}


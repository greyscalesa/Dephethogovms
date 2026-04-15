'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    LogIn,
    Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSite } from '@/lib/context/SiteContext';

interface Stat {
    label: string;
    value: string;
    color: string;
    iconColor: string;
}

const iconMap: Record<string, React.ElementType> = {
    'ACTIVE VISITS': Users,
    'EXPECTED TODAY': LogIn,
    'TOTAL VISITORS': Clock,
};

export default function DashboardStats() {
    const [stats, setStats] = useState<Stat[]>([]);
    const { selectedSiteId } = useSite();

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`/api/stats?siteId=${selectedSiteId}`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, [selectedSiteId]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') fetchStats();
        }, 30000); // 30s refresh only when active
        return () => clearInterval(interval);
    }, [fetchStats]);

    if (stats.length === 0) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-28 md:h-32 bg-white/50 animate-pulse rounded-[20px] md:rounded-[24px]" />
            ))}
        </div>
    );

    return (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:pb-0 gap-4 md:gap-6 no-scrollbar snap-x snap-mandatory">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.label] || Users;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[280px] md:min-w-0 flex-none snap-center bg-white p-5 md:p-6 rounded-[20px] md:rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden flex items-center justify-between"
                    >
                        {/* Orange left border accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#fa922c] rounded-full" />

                        <div>
                            <h3 className="text-3xl md:text-4xl font-black text-[#042f21] leading-tight font-outfit">{stat.value}</h3>
                            <p className="text-[#042f21]/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                        </div>

                        <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", stat.color)}>
                            <Icon className={stat.iconColor} size={24} strokeWidth={2.5} />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(' ');
}

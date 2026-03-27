'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    LogIn,
    Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
    'ACTIVE VISITS': Users,
    'EXPECTED TODAY': LogIn,
    'TOTAL VISITORS': Clock,
};

export default function DashboardStats() {
    const [stats, setStats] = useState<any[]>([]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (stats.length === 0) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/50 animate-pulse rounded-[24px]" />
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.label] || Users;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden flex items-center justify-between"
                    >
                        {/* Orange left border accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#fa922c] rounded-full" />

                        <div>
                            <h3 className="text-4xl font-black text-[#042f21] leading-tight font-outfit">{stat.value}</h3>
                            <p className="text-[#042f21]/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                        </div>

                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.color)}>
                            <Icon className={stat.iconColor} size={24} strokeWidth={2.5} />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

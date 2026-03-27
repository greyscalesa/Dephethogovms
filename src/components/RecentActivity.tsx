'use client';

import React from 'react';
import {
    LogIn,
    LogOut,
    Clock,
    UserPlus,
    ShieldAlert,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    QrCode,
} from 'lucide-react';

const activities = [
    {
        id: 1,
        user: 'John Smith',
        type: 'CONTRACTOR',
        action: 'Checked-in',
        target: 'Main Entrance',
        time: '2 mins ago',
        icon: LogIn,
        color: 'bg-blue-100 text-blue-600',
        iconColor: 'text-blue-600'
    },
    {
        id: 2,
        user: 'Sarah Miller',
        type: 'GUEST',
        action: 'Booked Visit',
        target: 'HR Dept',
        time: '45 mins ago',
        icon: QrCode,
        color: 'bg-emerald-100 text-emerald-600',
        iconColor: 'text-emerald-600'
    },
    {
        id: 3,
        user: 'Security Alert',
        type: 'SYSTEM',
        action: 'Unauthorized Scan',
        target: 'Server Room',
        time: '1h 22m ago',
        icon: AlertCircle,
        color: 'bg-rose-100 text-rose-600',
        iconColor: 'text-rose-600'
    },
    {
        id: 4,
        user: 'Robert Chen',
        type: 'VENDOR',
        action: 'Checked-out',
        target: 'Service Gate',
        time: '2h 14m ago',
        icon: LogOut,
        color: 'bg-slate-100 text-slate-500',
        iconColor: 'text-slate-500'
    },
    {
        id: 5,
        user: 'Emily Rose',
        type: 'INTERVIEWEE',
        action: 'Check-in Error',
        target: 'NDA missing',
        time: '3h ago',
        icon: AlertCircle,
        color: 'bg-orange-100 text-orange-600',
        iconColor: 'text-orange-600'
    },
];

export default function RecentActivity() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Live Activity</h3>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider">
                    View All
                </button>
            </div>

            <div className="space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.color} group-hover:scale-110 transition-transform`}>
                            <activity.icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-900 truncate">{activity.user}</p>
                                <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-widest">{activity.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                                <span className="text-xs font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                    {activity.type}
                                </span>
                                {activity.action} - {activity.target}
                            </p>
                        </div>
                        <div className="self-center">
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

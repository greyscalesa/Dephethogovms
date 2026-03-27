'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
} from 'recharts';

const data = [
    { name: 'Mon', total: 42, checkins: 28 },
    { name: 'Tue', total: 58, checkins: 35 },
    { name: 'Wed', total: 49, checkins: 32 },
    { name: 'Thu', total: 71, checkins: 45 },
    { name: 'Fri', total: 68, checkins: 55 },
    { name: 'Sat', total: 23, checkins: 15 },
    { name: 'Sun', total: 18, checkins: 10 },
];

export default function VisitorChart() {
    return (
        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 min-h-[500px] flex flex-col">
            <div className="flex items-start justify-between mb-10">
                <div>
                    <h3 className="text-3xl font-black text-[#042f21] leading-tight font-outfit uppercase tracking-tighter">Visitor Traffic</h3>
                    <p className="text-[#042f21]/40 text-sm font-bold mt-1 uppercase tracking-widest leading-loose">Weekly overview of check-ins and total visitors</p>
                </div>

                {/* Custom Legend */}
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#fa922c]" />
                        <span className="text-[11px] font-black text-[#042f21] uppercase tracking-widest">Total Visitors</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#042f21]" />
                        <span className="text-[11px] font-black text-[#042f21] uppercase tracking-widest">Check-ins</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fa922c" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#fa922c" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#042f21" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#042f21" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf2ee" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#042f21', fontSize: 11, fontWeight: '700' }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#042f21', fontSize: 11, fontWeight: '700' }}
                        />
                        <Tooltip
                            cursor={{ stroke: '#042f21', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{
                                borderRadius: '20px',
                                border: 'none',
                                boxShadow: '0 25px 50px -12px rgb(4 47 33 / 0.15)',
                                fontSize: '12px',
                                fontWeight: '900',
                                backgroundColor: '#ffffff',
                                color: '#042f21'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#fa922c"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                        />
                        <Area
                            type="monotone"
                            dataKey="checkins"
                            stroke="#042f21"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorCheckins)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

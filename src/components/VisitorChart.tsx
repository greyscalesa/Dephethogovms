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
    const [chartHeight, setChartHeight] = React.useState(320);

    React.useEffect(() => {
        const updateChartHeight = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setChartHeight(240);
                return;
            }
            if (width < 1024) {
                setChartHeight(280);
                return;
            }
            setChartHeight(360);
        };

        updateChartHeight();
        window.addEventListener('resize', updateChartHeight);
        return () => window.removeEventListener('resize', updateChartHeight);
    }, []);

    return (
        <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 min-h-[350px] md:min-h-[500px] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 md:mb-10">
                <div className="space-y-1">
                    <h3 className="text-2xl md:text-3xl font-black text-[#042f21] leading-tight font-outfit uppercase tracking-tighter">Visitor Traffic</h3>
                    <p className="text-[#042f21]/40 text-[10px] md:text-sm font-bold mt-1 uppercase tracking-widest leading-relaxed">Weekly overview of check-ins and total visitors</p>
                </div>

                {/* Custom Legend */}
                <div className="flex items-center gap-4 md:gap-6 pt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fa922c]" />
                        <span className="text-[10px] md:text-[11px] font-black text-[#042f21] uppercase tracking-widest">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#042f21]" />
                        <span className="text-[10px] md:text-[11px] font-black text-[#042f21] uppercase tracking-widest">Check-ins</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full mt-auto min-h-[240px]">
                <ResponsiveContainer width="100%" height={chartHeight}>
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

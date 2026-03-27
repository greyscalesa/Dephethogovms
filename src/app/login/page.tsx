'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#042f21] flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#fa922c]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-2xl relative z-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-[#fa922c] rounded-[24px] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#fa922c]/20 ring-4 ring-white/5 overflow-hidden">
                            <span className="text-3xl font-black italic">D</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-outfit text-center">Dephethogo</h1>
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase mt-2">Enterprise Access Control</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#fa922c] transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-[#fa922c]/50 focus:border-[#fa922c] transition-all"
                                    placeholder="admin@vms.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-4">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#fa922c] transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-[#fa922c]/50 focus:border-[#fa922c] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
                                <ShieldCheck size={18} /> {error}
                            </motion.div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full h-16 bg-[#fa922c] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#fa922c]/20 hover:bg-[#e07d20] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Acess Portal'}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                        © 2026 Dephethogo Access Systems. All Rights Reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

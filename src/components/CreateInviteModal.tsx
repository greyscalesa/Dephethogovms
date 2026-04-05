'use client';

import React, { useState, useEffect } from 'react';
import { 
    X, 
    User, 
    Calendar, 
    MapPin, 
    Clock, 
    Car, 
    Shield, 
    CheckCircle2, 
    Share2, 
    Download, 
    Printer, 
    Mail, 
    MessageCircle,
    Copy,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Visitor, VisitorType } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';

interface CreateInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (visitor: any) => void;
}

export default function CreateInviteModal({ isOpen, onClose, onSuccess }: CreateInviteModalProps) {
    const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
    const [loading, setLoading] = useState(false);
    const [createdVisitor, setCreatedVisitor] = useState<any>(null);
    const [hasVehicle, setHasVehicle] = useState(false);
    const [showPassport, setShowPassport] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        idNumber: '',
        arrivalDate: '',
        arrivalTime: '',
        duration: '1h',
        siteId: 'site-1',
        hostId: 'u-4',
        hostName: 'Alice Johnson',
        purpose: '',
        regNumber: '',
        vin: '',
        entryType: 'ONE_TIME' as 'ONE_TIME' | 'MULTIPLE',
        earlyCheckIn: 30
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
        if (!formData.arrivalTime) newErrors.arrivalTime = 'Arrival time is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const visitorData = {
                ...formData,
                type: 'GUEST',
                vehicleData: hasVehicle ? {
                    registration: formData.regNumber,
                    licenceDiscScanned: false,
                    vin: formData.vin
                } : undefined,
                entryType: formData.entryType,
                earlyCheckInMinutes: formData.earlyCheckIn
            };

            const res = await fetch('/api/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitorData),
            });

            const result = await res.json();
            if (result.success) {
                setCreatedVisitor(result.visitor);
                setStep('SUCCESS');
                onSuccess(result.visitor);
            } else {
                setErrors({ server: result.error || 'Check failed. Please verify details.' });
            }
        } catch (err) {
            console.error('Invite error:', err);
            setErrors({ server: 'Connection failed. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        const link = `https://yourapp.com/checkin?token=${createdVisitor.qrToken}`;
        navigator.clipboard.writeText(link);
        alert('Check-in link copied to clipboard!');
    };

    const handleShareWhatsApp = () => {
        const date = new Date(createdVisitor.arrivalDate || createdVisitor.createdAt).toLocaleDateString();
        const time = createdVisitor.arrivalTime || 'specified time';
        const link = `https://yourapp.com/checkin?token=${createdVisitor.qrToken}`;
        const message = `Hi ${createdVisitor.name}, your visit to ${createdVisitor.siteName || 'our site'} on ${date} at ${time} has been confirmed. Please present this QR code on arrival: ${link}`;
        window.open(`https://wa.me/${createdVisitor.phone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShareEmail = () => {
        const subject = "Your Visitor Pass - Confirmed";
        const message = `Hi ${createdVisitor.name}, your visit has been confirmed...`;
        window.open(`mailto:${createdVisitor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-[#042f21]/80 backdrop-blur-xl"
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Sticky Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">
                                {step === 'FORM' ? 'Create Invitation' : 'Invitation Confirmed'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                Secure Access Gateway v2.4
                            </p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-[#042f21] transition-all active:scale-90">
                            <X size={24} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
                        {step === 'FORM' ? (
                            <form id="invite-form" onSubmit={handleSubmit} className="space-y-12">
                                {/* Section 1: Visitor Information */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-[#fa922c]/10 text-[#fa922c] rounded-xl flex items-center justify-center">
                                            <User size={20} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-sm font-black text-[#042f21] uppercase tracking-widest">Visitor Identity</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                            <input 
                                                required
                                                className={`w-full h-14 px-5 bg-slate-50 border ${errors.name ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#fa922c]/20 outline-none font-bold transition-all`}
                                                placeholder="e.g. John Wick"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                                            <input 
                                                required
                                                className={`w-full h-14 px-5 bg-slate-50 border ${errors.phone ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#fa922c]/20 outline-none font-bold transition-all`}
                                                placeholder="+27 12 345 6789"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#fa922c]/20 outline-none font-bold transition-all"
                                                placeholder="email@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                                            <input 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#fa922c]/20 outline-none font-bold transition-all"
                                                placeholder="Acme Corp"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Shield size={18} className="text-slate-400" />
                                            <div>
                                                <p className="text-[11px] font-black text-[#042f21] uppercase tracking-tight">Identity Verification</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Require ID or Passport on arrival</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassport(!showPassport)}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${showPassport ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showPassport ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    
                                    {showPassport && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 overflow-hidden">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID / Passport Number</label>
                                            <input 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                                                value={formData.idNumber}
                                                onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                                            />
                                        </motion.div>
                                    )}
                                </section>

                                {/* Section 2: Visit Details */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-50">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Calendar size={20} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-sm font-black text-[#042f21] uppercase tracking-widest">Visit Parameters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Date *</label>
                                            <input 
                                                type="date"
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold transition-all"
                                                value={formData.arrivalDate}
                                                onChange={e => setFormData({ ...formData, arrivalDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Time *</label>
                                            <input 
                                                type="time"
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold transition-all"
                                                value={formData.arrivalTime}
                                                onChange={e => setFormData({ ...formData, arrivalTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Location</label>
                                            <select 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0cm9rZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat"
                                                value={formData.siteId}
                                                onChange={e => setFormData({ ...formData, siteId: e.target.value })}
                                            >
                                                <option value="site-1">Headquarters (Pretoria)</option>
                                                <option value="site-2">Johannesburg Branch</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Host / Person to Visit</label>
                                            <select 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0cm9rZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat"
                                                value={formData.hostId}
                                                onChange={e => {
                                                    const hostName = e.target.options[e.target.selectedIndex].text;
                                                    setFormData({ ...formData, hostId: e.target.value, hostName });
                                                }}
                                            >
                                                <option value="u-4">Alice Johnson (IT)</option>
                                                <option value="u-5">Robert Smith (Sales)</option>
                                                <option value="u-6">Jane Doe (Finance)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose of Visit</label>
                                        <textarea 
                                            rows={3}
                                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold resize-none"
                                            placeholder="Discuss maintenance plan..."
                                            value={formData.purpose}
                                            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                        />
                                    </div>
                                </section>

                                {/* Section 3: Vehicle */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold tracking-tight">Vehicle Access</h3>
                                                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Optional Entry Permission</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setHasVehicle(!hasVehicle)}
                                            className={`w-14 h-7 rounded-full transition-colors relative ${hasVehicle ? 'bg-emerald-500' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${hasVehicle ? 'left-8' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {hasVehicle && (
                                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                                                <input 
                                                    className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl outline-none font-bold uppercase transition-all"
                                                    placeholder="GP 123 456"
                                                    value={formData.regNumber}
                                                    onChange={e => setFormData({ ...formData, regNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VIN (Optional)</label>
                                                <input 
                                                    className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl outline-none font-bold uppercase transition-all"
                                                    placeholder="WBA123..."
                                                    value={formData.vin}
                                                    onChange={e => setFormData({ ...formData, vin: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <button type="button" className="w-full py-4 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#042f21] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                                    <Printer size={16} /> Scan Digital Licence Disc
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </section>

                                {/* Section 4: Access Settings */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-50">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <Shield size={20} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-sm font-black text-[#042f21] uppercase tracking-widest">Access Control</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Type</label>
                                            <div className="flex p-1 bg-slate-100 rounded-2xl">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, entryType: 'ONE_TIME' })}
                                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.entryType === 'ONE_TIME' ? 'bg-white shadow-sm text-[#042f21]' : 'text-slate-400'}`}
                                                >
                                                    Single Entry
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, entryType: 'MULTIPLE' })}
                                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.entryType === 'MULTIPLE' ? 'bg-white shadow-sm text-[#042f21]' : 'text-slate-400'}`}
                                                >
                                                    Multi-Entry
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Early Warning Window</label>
                                            <select 
                                                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0cm9rZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat"
                                                value={formData.earlyCheckIn}
                                                onChange={e => setFormData({ ...formData, earlyCheckIn: parseInt(e.target.value) })}
                                            >
                                                <option value={15}>15 Minutes</option>
                                                <option value={30}>30 Minutes</option>
                                                <option value={60}>1 Hour</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            </form>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-10 py-10"
                            >
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                                        <CheckCircle2 size={48} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-[#042f21] tracking-tighter uppercase font-outfit">Access Granted</h3>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-2">Internal Gate ID: {createdVisitor?.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-6 bg-slate-50 rounded-[40px] border border-slate-100">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Visitor</p>
                                        <p className="font-bold text-sm text-[#042f21]">{createdVisitor?.name}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Host</p>
                                        <p className="font-bold text-sm text-[#042f21]">{createdVisitor?.hostName}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-sm text-[#042f21]">{new Date(createdVisitor?.arrivalDate || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Pending</span>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[48px] blur-3xl opacity-50" />
                                    <div className="relative p-10 bg-white border border-slate-100 rounded-[48px] shadow-2xl">
                                        <QRCodeSVG 
                                            value={`https://yourapp.com/checkin?token=${createdVisitor?.qrToken}`}
                                            size={200}
                                            level="K"
                                            includeMargin={false}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
                                    <button onClick={handleShareWhatsApp} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100">
                                        <MessageCircle size={24} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
                                    </button>
                                    <button onClick={handleShareEmail} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                                        <Mail size={24} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Email</span>
                                    </button>
                                    <button onClick={handleCopyLink} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                        <Copy size={24} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Copy Link</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                        <Download size={24} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Save PNG</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                        <Printer size={24} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Print ID</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-xl shrink-0">
                        {step === 'FORM' ? (
                            <div className="space-y-4">
                                {errors.server && (
                                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-xs font-bold text-rose-500 uppercase tracking-widest">{errors.server}</motion.p>
                                )}
                                <button 
                                    form="invite-form"
                                    type="submit"
                                    disabled={loading || !formData.name || !formData.phone}
                                    className="w-full h-16 md:h-20 bg-[#fa922c] disabled:opacity-50 disabled:grayscale text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#fa922c]/30 hover:bg-[#e07d20] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Initializing Gate Authorization...
                                    </>
                                ) : (
                                    <>
                                        Confirm Reservation
                                        <Share2 size={20} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setStep('FORM')}
                                    className="flex-1 h-16 bg-slate-100 text-[#042f21] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Create Another Invite
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="flex-1 h-16 bg-[#042f21] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#042f21]/20 hover:bg-black transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

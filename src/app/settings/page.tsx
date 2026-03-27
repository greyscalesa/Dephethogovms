'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Globe,
    Palette,
    ShieldCheck,
    ChevronRight,
    Check,
    Save,
} from 'lucide-react';

type SectionID = 'general' | 'profile' | 'security' | 'branding';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SectionID>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form States
    const [settings, setSettings] = useState({
        companyName: 'Dephethogo Group',
        defaultSite: 'Pretoria HQ',
        timezone: 'GMT+2 (SAST)',
        userName: 'Super Admin',
        userEmail: 'admin@dephethogo.com',
        notifyEmail: true,
        notifySms: false,
        twoFactor: true,
        primaryColor: '#ff8c00',
        appName: 'Dephethogo Access'
    });

    useEffect(() => {
        const saved = localStorage.getItem('vms_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        // Mock API call
        setTimeout(() => {
            localStorage.setItem('vms_settings', JSON.stringify(settings));
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const sections = [
        { id: 'general', title: 'General', icon: SettingsIcon },
        { id: 'profile', title: 'Personal', icon: User },
        { id: 'security', title: 'Security', icon: ShieldCheck },
        { id: 'branding', title: 'Branding', icon: Palette },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#f8faf9]">
            <TopHeader />

            <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-10 overflow-hidden">
                {/* Internal Sidebar */}
                <div className="w-full md:w-80 flex flex-col shrink-0 gap-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 font-outfit uppercase">Settings</h1>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as SectionID)}
                            className={`flex items-center gap-4 p-5 rounded-2xl transition-all font-bold ${activeSection === section.id
                                    ? 'bg-white shadow-xl text-emerald-900 shadow-emerald-900/5 border border-emerald-900/10'
                                    : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
                                }`}
                        >
                            <div className={`p-2 rounded-xl border ${activeSection === section.id ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}>
                                <section.icon size={20} />
                            </div>
                            <span className="text-[15px] uppercase tracking-widest">{section.title}</span>
                            {activeSection === section.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="flex-1 bg-white rounded-[40px] shadow-2xl shadow-emerald-900/5 border border-slate-100 p-10 overflow-y-auto no-scrollbar flex flex-col">
                    <div className="flex-1 space-y-10">
                        {activeSection === 'general' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <SectionHeader title="General Configuration" description="Manage primary company settings and platform defaults." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input label="Company Entity Name" value={settings.companyName} onChange={v => updateSetting('companyName', v)} />
                                    <Input label="Primary Operating Site" value={settings.defaultSite} onChange={v => updateSetting('defaultSite', v)} />
                                    <Select label="Global Timezone" value={settings.timezone} options={['GMT+2 (SAST)', 'GMT+0 (UTC)', 'GMT-5 (EST)']} onChange={v => updateSetting('timezone', v)} />
                                </div>
                            </div>
                        )}

                        {activeSection === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <SectionHeader title="Personal Account" description="Manage your contact details and notification preferences." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input label="Full Name" value={settings.userName} onChange={v => updateSetting('userName', v)} />
                                    <Input label="Email Address" value={settings.userEmail} disabled />
                                </div>
                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Channels</h4>
                                    <Toggle label="Enable Email Alerts" active={settings.notifyEmail} onToggle={v => updateSetting('notifyEmail', v)} />
                                    <Toggle label="Enable SMS Notifications" active={settings.notifySms} onToggle={v => updateSetting('notifySms', v)} />
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <SectionHeader title="Security Controls" description="Configure platform access levels and authentication methods." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input label="Platform Access Secret" value="********" type="password" />
                                    <Select label="Session Expiry Template" value="Standard (8h)" options={['Secure (2h)', 'Standard (8h)', 'Extended (24h)']} />
                                </div>
                                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-900 font-bold mb-1">Two-Factor Authentication</p>
                                        <p className="text-emerald-900/50 text-xs">Verify login via mobile authenticator code.</p>
                                    </div>
                                    <Toggle label="" active={settings.twoFactor} onToggle={v => updateSetting('twoFactor', v)} />
                                </div>
                            </div>
                        )}

                        {activeSection === 'branding' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <SectionHeader title="Branding & UI Identity" description="Customize how the platform looks for your specific organization." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input label="Application Name" value={settings.appName} onChange={v => updateSetting('appName', v)} />
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Primary Brand Color</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={e => updateSetting('primaryColor', e.target.value)}
                                                className="w-16 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                                            />
                                            <div className="flex-1 px-4 h-12 flex items-center bg-slate-50 rounded-xl border border-slate-100 text-sm font-mono text-slate-600">
                                                {settings.primaryColor}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">Settings are synced with your corporate profile.</p>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-3 px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${saveSuccess
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#13604d] text-white hover:bg-[#0d4a3b]'
                                } ${isSaving ? 'opacity-70 scale-95' : ''}`}
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : saveSuccess ? (
                                <Check size={20} strokeWidth={4} />
                            ) : (
                                <Save size={20} />
                            )}
                            {saveSuccess ? 'Changes Saved' : 'Commit Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="pb-6 border-b border-slate-50">
            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight">{title}</h2>
            <p className="text-slate-400 mt-2 font-medium">{description}</p>
        </div>
    );
}

function Input({ label, value, onChange, type = 'text', disabled = false }: { label: string, value: string, onChange?: (v: string) => void, type?: string, disabled?: boolean }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={e => onChange?.(e.target.value)}
                className={`w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
    );
}

function Select({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange?: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
            <select
                value={value}
                onChange={e => onChange?.(e.target.value)}
                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all outline-none cursor-pointer appearance-none"
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}

function Toggle({ label, active, onToggle }: { label: string, active: boolean, onToggle: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-slate-600">{label}</span>
            <button
                onClick={() => onToggle(!active)}
                className={`w-14 h-8 rounded-full transition-all relative p-1 leading-none ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}


'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteContextType {
    selectedSiteId: string; // 'all' or specific site ID
    setSelectedSiteId: (id: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const [selectedSiteId, setSelectedSiteId] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('vms_selected_site') || 'all';
        }
        return 'all';
    });

    const handleSetSelectedSiteId = (id: string) => {
        setSelectedSiteId(id);
        localStorage.setItem('vms_selected_site', id);
    };

    return (
        <SiteContext.Provider value={{ selectedSiteId, setSelectedSiteId: handleSetSelectedSiteId }}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
}

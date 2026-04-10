import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { sessionCookieConfig, verifySessionToken } from '@/lib/session';

export type AuthUser = {
    id: string;
    role: string;
    companyId: string | null;
    siteId: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get(sessionCookieConfig.name);
    if (!session) return null;

    const payload = await verifySessionToken(session.value);
    if (!payload) return null;

    const { data: users, error } = await supabase
        .from('users')
        .select('id, role, company_id, site_id')
        .eq('id', payload.id)
        .limit(1);

    if (error || !users?.[0]) return null;

    const user = users[0];
    return {
        id: user.id,
        role: user.role,
        companyId: user.company_id ?? null,
        siteId: user.site_id ?? null,
    };
}

export function isPlatformAdmin(user: AuthUser): boolean {
    return user.role === 'platform_admin';
}

export function canAccessCompany(user: AuthUser, companyId?: string | null): boolean {
    if (isPlatformAdmin(user)) return true;
    if (!companyId) return false;
    return user.companyId === companyId;
}

export function canAccessSite(user: AuthUser, siteId?: string | null): boolean {
    if (isPlatformAdmin(user)) return true;
    if (!siteId) return false;
    if (user.siteId) return user.siteId === siteId;
    return true;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: Supabase environment variables are missing! Deployment will fail to connect.');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://dummy.supabase.co', 
    supabaseAnonKey || 'dummy-key-for-builds'
);

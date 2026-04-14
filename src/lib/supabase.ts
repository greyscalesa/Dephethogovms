import { createClient } from '@supabase/supabase-js';

function readRequiredEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    const value = process.env[name];
    if (value && value.length > 0) {
        return value;
    }
    return null;
}

const supabaseUrl = readRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey =
    readRequiredEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
    readRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

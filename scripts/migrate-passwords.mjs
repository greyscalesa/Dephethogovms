/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

function isBcryptHash(value) {
    return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

function parseArgs(argv) {
    const args = {
        apply: false,
        limit: 1000,
        email: null,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === '--apply') args.apply = true;
        if (token === '--limit') {
            const next = Number(argv[i + 1]);
            if (Number.isFinite(next) && next > 0) args.limit = next;
        }
        if (token === '--email') {
            args.email = argv[i + 1] || null;
        }
    }

    return args;
}

async function main() {
    const { apply, limit, email } = parseArgs(process.argv.slice(2));
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (preferred).'
        );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase.from('users').select('id, email, password').limit(limit);
    if (email) query = query.eq('email', email);

    const { data: users, error } = await query;
    if (error) throw error;

    const candidates = (users || []).filter((u) => typeof u.password === 'string' && u.password.length > 0 && !isBcryptHash(u.password));

    console.log(`Scanned users: ${(users || []).length}`);
    console.log(`Plaintext candidates: ${candidates.length}`);
    if (candidates.length === 0) {
        console.log('Nothing to migrate.');
        return;
    }

    if (!apply) {
        console.log('Dry run mode (no updates).');
        console.log('Run with --apply to execute updates.');
        for (const user of candidates) {
            console.log(`- ${user.email} (${user.id})`);
        }
        return;
    }

    let updated = 0;
    for (const user of candidates) {
        const hashed = await bcrypt.hash(user.password, 10);
        const { error: updateError } = await supabase.from('users').update({ password: hashed }).eq('id', user.id);
        if (updateError) {
            console.error(`Failed: ${user.email} (${user.id}) -> ${updateError.message}`);
            continue;
        }
        updated += 1;
        console.log(`Updated: ${user.email} (${user.id})`);
    }

    console.log(`Migration complete. Updated ${updated}/${candidates.length} users.`);
}

main().catch((err) => {
    console.error('Password migration failed:', err.message || err);
    process.exit(1);
});

-- ============================================
-- Supabase Migration: Complete VMS Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add missing columns to visitors table
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS arrival_date TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS arrival_time TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS reg_number TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'ONE_TIME';
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS early_check_in_minutes INTEGER DEFAULT 30;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS check_out TIMESTAMP WITH TIME ZONE;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP WITH TIME ZONE;

-- 2. Create incidents table (for emergency module)
CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    type TEXT,
    description TEXT,
    site_id TEXT REFERENCES sites(id),
    reporter_id TEXT,
    severity TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS with permissive demo policy
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for VMS demo" ON incidents FOR ALL USING (true);

-- 3. Seed sites FIRST (users reference sites via foreign key)
INSERT INTO sites (id, company_id, name, code, address, contact_number, contact_email, manager_id, operating_hours, max_occupancy, qr_prefix, type, status)
VALUES ('site-1', 'comp-1', 'Headquarters', 'HQ-001', '123 Green Ave, Pretoria', '012 345 6789', 'hq@dephethogo.com', 'u-2', '08:00 - 18:00', 500, 'HQ', 'OFFICE', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sites (id, company_id, name, code, address, contact_number, contact_email, manager_id, operating_hours, max_occupancy, qr_prefix, type, status)
VALUES ('site-2', 'comp-1', 'Johannesburg Branch', 'JHB-002', '456 Gold St, Sandton', '011 987 6543', 'jhb@dephethogo.com', 'u-4', '07:00 - 19:00', 200, 'JB', 'OFFICE', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed users (after sites exist)
INSERT INTO users (id, company_id, role, full_name, email, password)
VALUES ('u-1', 'comp-1', 'SUPER_ADMIN', 'Super Admin', 'admin@vms.com', 'password123')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;

INSERT INTO users (id, company_id, role, full_name, email, password)
VALUES ('u-2', 'comp-1', 'COMPANY_ADMIN', 'Lesego Admin', 'lesego@dephethogo.com', 'password123')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;

INSERT INTO users (id, company_id, site_id, role, full_name, email, password)
VALUES ('u-3', 'comp-1', 'site-1', 'SECURITY', 'Security One', 'security@vms.com', 'password123')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;

INSERT INTO users (id, company_id, site_id, role, full_name, email, password, department, is_host)
VALUES ('u-4', 'comp-1', 'site-1', 'EMPLOYEE', 'Alice Johnson', 'alice@dephethogo.com', 'password123', 'IT', true)
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, department = EXCLUDED.department, is_host = EXCLUDED.is_host;

-- 5. Seed entry points (after sites exist)
INSERT INTO entry_points (id, site_id, name, type, status, last_guard_id)
VALUES ('ep-1', 'site-1', 'Main Gate', 'GATE', 'ACTIVE', 'u-3')
ON CONFLICT (id) DO NOTHING;

INSERT INTO entry_points (id, site_id, name, type, status)
VALUES ('ep-2', 'site-1', 'Reception Desk 1', 'RECEPTION', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Done! Verify with:
-- SELECT * FROM users;
-- SELECT * FROM sites;

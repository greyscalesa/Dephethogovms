-- VMS Supabase Schema Initialization

-- 1. Companies Table
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT,
    status TEXT DEFAULT 'ACTIVE'
);

-- 2. Sites Table
CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id),
    name TEXT NOT NULL,
    code TEXT,
    address TEXT,
    contact_number TEXT,
    contact_email TEXT,
    manager_id TEXT,
    operating_hours TEXT,
    max_occupancy INTEGER,
    qr_prefix TEXT,
    type TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Entry Points Table
CREATE TABLE entry_points (
    id TEXT PRIMARY KEY,
    site_id TEXT REFERENCES sites(id),
    name TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'ACTIVE',
    last_guard_id TEXT
);

-- 4. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id),
    site_id TEXT REFERENCES sites(id),
    role TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- For real production, use Supabase Auth instead!
    department TEXT,
    is_host BOOLEAN DEFAULT false
);

-- 5. Visitors Table
CREATE TABLE visitors (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id),
    site_id TEXT REFERENCES sites(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    type TEXT,
    status TEXT DEFAULT 'PENDING',
    host_id TEXT REFERENCES users(id),
    host_name TEXT,
    qr_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    scan_attempts INTEGER DEFAULT 0,
    check_in TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Bookings Table
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    visitor_name TEXT NOT NULL,
    company TEXT,
    scheduled_time TEXT,
    site_id TEXT REFERENCES sites(id),
    host_id TEXT REFERENCES users(id),
    type TEXT,
    status TEXT DEFAULT 'PRE_BOOKED',
    qr_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (temporarily allowing all for transition)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access for VMS demo" ON companies FOR ALL USING (true);
CREATE POLICY "Allow public access for VMS demo" ON sites FOR ALL USING (true);
CREATE POLICY "Allow public access for VMS demo" ON entry_points FOR ALL USING (true);
CREATE POLICY "Allow public access for VMS demo" ON users FOR ALL USING (true);
CREATE POLICY "Allow public access for VMS demo" ON visitors FOR ALL USING (true);
CREATE POLICY "Allow public access for VMS demo" ON bookings FOR ALL USING (true);

-- Optional: Insert dummy company to fulfill Foreign Key constraints
INSERT INTO companies (id, name, domain) VALUES ('comp-1', 'Dephethogo Corp', 'dephethogo.com');
-- Insert dummy user (host)
INSERT INTO users (id, company_id, role, full_name, email) VALUES ('u-4', 'comp-1', 'EMPLOYEE', 'Alice Johnson', 'alice@dephethogo.com');

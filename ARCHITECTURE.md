# VisitMe VMS Architecture & Database Schema (v2.0 - Multi-Site)

## 🏗️ System Architecture

- **Hierarchy**: Platform (Super Admin) → Company (Company Admin) → Sites (Site Admin).
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Framer Motion, Recharts.
- **Backend**: Next.js API Routes (Serverless ready).
- **Auth**: JWT-based RBAC with multi-site scoping.

## 📂 Database Schema (PostgreSQL)

### 1. `companies`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| name | VARCHAR | Company name |
| domain | VARCHAR | Corporate domain |
| status | ENUM | ACTIVE, SUSPENDED |

### 2. `sites` (NEW)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| company_id | UUID (FK) | Tenancy link |
| site_name | VARCHAR | Site identifier |
| address | TEXT | Physical address |
| contact_person | VARCHAR | Site Manager |
| contact_email | VARCHAR | Manager email |
| created_at | TIMESTAMP | |

### 3. `users` (Staff & Admins)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| company_id | UUID (FK) | (NULL for Platform Admin) |
| site_id | UUID (FK) | (NULL for Platform/Company Admin) |
| role | ENUM | PLATFORM_ADMIN, COMPANY_ADMIN, SITE_ADMIN, SECURITY, HOST |
| email | VARCHAR (Unique)| |
| password_hash | TEXT | |
| full_name | VARCHAR | |

### 4. `visitors`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| company_id | UUID (FK) | |
| site_id | UUID (FK) | Site identification |
| full_name | VARCHAR | |
| email | VARCHAR | |
| type | ENUM | CONTRACTOR, GUEST, VENDOR, etc. |

### 5. `transactions`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| visitor_id | UUID (FK) | |
| site_id | UUID (FK) | Link to physical location |
| check_in_time | TIMESTAMP | |
| check_out_time | TIMESTAMP | |
| status | ENUM | ON_SITE, CHECKED_OUT |

### 6. `bookings` (Pre-scheduling)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| site_id | UUID (FK) | Site targeted for visit |
| visitor_id | UUID (FK) | |
| host_id | UUID (FK) | |
| scheduled_time | TIMESTAMP | |
| status | ENUM | PENDING, CONFIRMED, CANCELLED |

---

## 🚀 API Route Structure

### `/api/auth`
- `POST /login`: Generate JWT with `company_id` and `site_id` (if applicable)

### `/api/companies`
- `GET /`: List all (Platform Admin only)
- `POST /`: Create company

### `/api/sites`
- `GET /?companyId=...`: List for specific company
- `POST /`: Create new site entry

### `/api/visitors` (Must filter by `site_id` derived from JWT or Request)
- `GET /?siteId=...`: List visitors for location
- `POST /`: Submit check-in for specific site

### `/api/reports`
- `GET /site-analytics?siteId=...`: Statistics per location
- `GET /company-analytics?companyId=...`: Aggregated cross-site data

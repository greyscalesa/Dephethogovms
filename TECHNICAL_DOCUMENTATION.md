# Dephethogo Access: Technical Documentation

## 1. Executive Summary
**Dephethogo Access** is an enterprise-grade Visitor Management System (VMS) designed for multi-tenant, multi-site environments. The platform provides a seamless, secure, and brand-aligned experience for managing visitor traffic, host notifications, and site security. 

Built with **Next.js 15**, **Tailwind CSS 4**, and **PostgreSQL**, the system prioritizes high-performance rendering, responsive layouts, and a premium "Dephethogo" minimalist aesthetic.

---

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 15.1.4 (App Router)
- **State Management**: React Hooks + Context API
- **Styling**: Tailwind CSS v4.0.0 (Modern CSS-first approach)
- **Animations**: Framer Motion 12.0.0+ (Micro-interactions, staggered lists)
- **Icons**: Lucide React
- **Charts**: Recharts (Customized for brand colors)
- **Typography**: 
  - *Inter*: Body text for maximum readability.
  - *Outfit*: Headings for a sophisticated, modern feel.

### Backend & Data
- **Environment**: Node.js (Runtime)
- **Database**: PostgreSQL (Relational schema for ACID compliance)
- **API Architecture**: Next.js API Routes (Serverless ready)
- **Validation**: Zod (Schema-driven runtime validation)
- **Utilities**: `date-fns` for time handling, `axios` for HTTP.

---

## 3. Architecture Overview

### Hierarchy (Standard Multi-tenancy)
The system follows a strict hierarchical access model:
1. **Platform (Super Admin)**: Global oversight across all clients.
2. **Company (Tenant Admin)**: Management of a single enterprise entity.
3. **Site (Location Admin)**: Management of specific physical buildings/sites.
4. **Security/Host**: Daily operational roles for check-ins and hosting.

### Key Directory Structure
```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API)
│   ├── (auth)/           # Authentication flows (Login/Logout)
│   ├── dashboard/       # Main operational interface
│   ├── scanner/         # QR/Barcode scanner module
│   ├── visitors/        # Visitor log management
│   ├── companies/       # Multi-tenant management views
│   └── api/             # Serverless API endpoints
├── components/           # Atomic Design UI library
│   ├── Sidebar.tsx      # Branded navigation (Dephethogo Green)
│   ├── DataTable.tsx    # Reusable enterprise-grade tables
│   ├── VisitorChart.tsx # Analytic visualizations
│   └── Logo.tsx         # Brand identity component
├── lib/                  # Shared utilities and types
│   ├── types.ts         # Global interface definitions
│   └── db.ts            # Database client initialization
└── styles/               # Global CSS and Design Tokens
```

---

## 4. Database Schema & Data Models

### Enums & Domain Constants
The system utilizes strict TypeScript enums to maintain data integrity across the platform:
- **VisitorType**: `CONTRACTOR`, `INTERVIEWEE`, `VENDOR`, `GUEST`, `DELIVERY`.
- **VisitorStatus**: `ON-SITE`, `CHECKED-OUT`, `PRE-BOOKED`, `PENDING`.
- **UserRole**: `PLATFORM_ADMIN`, `COMPANY_ADMIN`, `SITE_ADMIN`, `SECURITY`, `HOST`.

### Core Entities (PostgreSQL / TypeScript Interfaces)
| Entity | Key Fields | Purpose |
| :--- | :--- | :--- |
| **Companies** | `id`, `name`, `domain`, `status`, `logoUrl` | Tenant configuration and branding. |
| **Sites** | `id`, `companyId`, `name`, `address` | Physical location management. |
| **Users** | `id`, `fullName`, `email`, `role`, `siteId?` | Identity and access management. |
| **Visitors** | `id`, `type`, `status`, `checkIn`, `qrCode` | Guest profiles and real-time tracking. |
| **Bookings** | `id`, `visitorId`, `hostId`, `scheduledTime` | Pre-arrival management and QR invitations. |
| **Employees** | `id`, `fullName`, `department`, `isHost` | Internal staff list for visitor hosting. |

---

## 5. User Roles & Access Control (RBAC)
The system implements a granular RBAC model:
- **Platform Admin**: Global system configuration, company onboarding, and cross-tenant billing access.
- **Company Admin**: Oversight of all sites within their enterprise domain. Can manage global company settings.
- **Site Admin**: Restricted to a specific physical site. Manages local employees and site-specific reports.
- **Security**: Operational access to the Scanner and Visitor Log for real-time check-ins/outs.
- **Host**: Employees who can receive visitors and manage their own invited guests.

---

## 6. Design System & Branding

### Brand Colors (Dephethogo Palette)
- **Primary**: `#FF8C00` (Vibrant Orange) - Used for CTAs and status highlights.
- **Deep Hunter Green**: `#032319` - Sidebar and core structural background.
- **Mint Slate**: `#F4F7F6` - Main application background for high contrast.
- **Secondary Green**: `#13604D` - Used for secondary interactive elements.

### UI Principles
- **Glassmorphism**: Subtle backdrops for overlays.
- **Micro-animations**: Staggered fades for list items and smooth sidebar transitions with Framer Motion.
- **Accessibility**: High contrast ratios (WCAG 2.1 compliant colors) and focused outlines.

---

---

## 7. Functional Modules

### A. Real-time Dashboard & Analytics
- **Dynamic KPIs**: Instant tracking of daily visitor volumes, check-in status, and occupancy limits.
- **Analytics Visualization**: Interactive Recharts components representing traffic-to-site hourly and weekly trends.
- **Role-specific Data**: Content filters automatically based on the user's scope (Company vs Site).

### B. Intelligent QR Scanner
- **Seamless Check-ins**: A mobile-optimized scanner that processes pre-booked appointments instantly.
- **Manual Override**: Form-based visitor registration for hardware-agnostic check-ins.
- **Instant Validation**: Real-time cross-referencing against the `Bookings` and `Transactions` tables.

### C. Visitor & Site Management
- **Centralized Profiles**: Common guest information database for easy re-registration across multiple sites of the same company.
- **Audit Trails**: Every entry is timestamped and user-stamped for comprehensive site security review.

---

## 8. Security & Privacy Compliance

### User Data Isolation
- Each company's data is isolated using deep multi-tenant logic. No global querying across different `Company IDs` is allowed at the application layer.

### Identity Management
- **JWT-Based Authentication**: Secure, stateless authentication for all API and frontend operations.
- **Granular RBAC**: Permissions are strictly enforced based on the `UserRole` enum.

### Audit & Governance
- **Comprehensive Logging**: Every check-in/out event records `Host ID`, `Visitor ID`, `Site ID`, and exact time.
- **Data Retention**: Configurable retention periods in accordance with regional data privacy laws.

---

## 9. Build, Deployment & Maintenance

### Workflow & Pipelines
1. `npm install`: Standard dependency resolution.
2. `npm run dev`: Hot-reloading development environment with ESLint integration.
3. `npm run build`: Production-ready bundling (Next.js SWC minification).
4. `npm run start`: High-concurrency production server execution.

### Infrastructure Readiness
- Compatible with modern cloud platforms (Vercel, AWS, Azure).
- Standardized environment variable structures (DB connection strings, JWT secrets).

---
*Created by: Antigravity AI Implementation Team*
*Last Updated: March 2026*

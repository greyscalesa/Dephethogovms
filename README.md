# VisitMe VMS Boilerplate

## 🚀 Getting Started

0. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local` and fill required values.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Navigate to pages**:
   - `/` - Dashboard
   - `/scanner` - QR Scanner (Mocked)
   - `/visitors` - Visitor Tracking
   - `/companies` - Multi-tenant management

## 🎨 UI/UX Features

- **Sidebar Navigation**: Responsive, animated with Framer Motion.
- **Top Header**: Search, Notifications, Profile.
- **Modern Dashboard**: Recharts-based traffic analytics, Stat cards.
- **Scanner View**: Full-screen QR detection UI with manual entry fallback.
- **Enterprise Design**: Slate/Blue theme, Inter & Outfit fonts, 2xl rounded cards.

## 📁 Key File Structure

- `src/app/` - Next.js App Router (Pages & Layout)
- `src/components/` - Shared UI components (Charts, Tables, Layout)
- `src/lib/types.ts` - Shared Core domain types.
- `ARCHITECTURE.md` - Full Database & API schema.
- `AUDIT_FIX_CHECKLIST.md` - Prioritized P0/P1/P2 hardening backlog.

## 🚢 Deployment Target

- This app is configured for Netlify-compatible Next.js deployment (`npm run build`).

## 🔐 Password Migration

- Dry run (no updates): `npm run migrate:passwords`
- Apply updates: `npm run migrate:passwords -- --apply`
- Optional targeting: `npm run migrate:passwords -- --email user@example.com`

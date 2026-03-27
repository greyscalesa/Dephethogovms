# VisitMe VMS Boilerplate

## 🚀 Getting Started

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

# Patient Visit Tracker (WoundTech Health)

A premium, full-stack medical visit tracking system designed for healthcare administrators to manage clinicians, patients, and their interactions.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (Neon.tech recommended)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env # Update with your connection string
node index.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env # Update VITE_API_BASEURL if needed
npm run dev
```

**Credentials**: `admin@tracker.com` / `admin123`

---

## 🛠️ Design & Architecture

### Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion (Animations), Lucide (Icons).
- **Backend**: Node.js, Express, Morgan (Logging).
- **Database**: PostgreSQL (Neon Serverless).

### Intentional Decisions
1.  **Glassmorphism 2.0**: Used a custom glassmorphism style with multi-layered translucency to provide a high-end, futuristic feel while maintaining readability.
2.  **Tailwind v4 + Vite Plugin**: Leveraged the new `@tailwindcss/vite` plugin for superior performance and automatic utility detection, ensuring a lean production bundle.
3.  **Spring Physics**: All UI transitions (modals, tabs) use `framer-motion` spring physics rather than linear durations for a more organic and responsive feel.
4.  **Temporal Timeline**: Instead of a traditional table for visits, I implemented a "Temporal Activity Feed" to better visualize the chronological flow of medical interactions.
5.  **Vite Environment System**: Used `import.meta.env` with `VITE_` prefixes to strictly separate build-time and runtime configurations, preventing environmental leaks.

## 📁 Structure
- `/server`: Express API with PostgreSQL integration.
- `/frontend`: React application organized by features (`auth`, `clinicians`, `patients`, `visits`) and common components.
- `/brain`: Development snapshots and implementation plans.

## 🧪 Verification
- [x] Full CRUD operations for Clinicians and Patients.
- [x] Visit logging with clinician-patient linkage.
- [x] Responsive layout (Mobile/Desktop).
- [x] Production build optimized (`npm run build`).

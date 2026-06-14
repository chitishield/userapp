# ChitiShield — Frontend

Next.js 14 frontend for the GDPR & DPDPA Compliance Certification Platform.

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 14 (App Router)           |
| Language       | TypeScript 5                      |
| Styling        | Tailwind CSS 3 + custom design system |
| Components     | shadcn/ui patterns + Radix UI     |
| Icons          | Lucide React                      |
| Charts         | Recharts                          |
| Forms          | React Hook Form + Zod             |
| HTTP client    | Axios with JWT interceptors       |
| Auth           | RS256 JWT — js-cookie + jose      |
| Notifications  | Sonner                            |
| Animations     | Framer Motion                     |

## Project Structure

```
ChitiShield/
├── app/
│   ├── auth/login/          Login page
│   ├── dashboard/
│   │   ├── page.tsx         Main dashboard
│   │   ├── assessment/      Compliance assessment + rule results
│   │   ├── consent/         Consent records management
│   │   ├── dsr/             Data subject requests + SLA timers
│   │   ├── breaches/        Breach management + 72hr countdown
│   │   ├── certificates/    Certificate issuance + verification
│   │   ├── data-map/        Processing activities + PII scanner
│   │   └── audit/           Immutable audit trail
│   ├── layout.tsx           Root layout + Toaster
│   └── globals.css          Design system CSS variables
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      Navigation sidebar
│   │   └── Topbar.tsx       Page header + CTA
│   ├── ui/index.tsx         StatCard, Badge, GaugeRing, SLATimer, etc.
│   └── modals/index.tsx     DSR, Breach, Consent, NotifyAuthority modals
│
├── lib/
│   ├── api.ts               Typed Axios client → FastAPI backend
│   ├── auth.ts              JWT decode, cookie management, role checks
│   └── utils.ts             cn(), formatters, SLA helpers, score colors
│
├── hooks/
│   └── useCompliance.ts     useFetch, useMutation, useCountdown, useSLAClock
│
├── types/index.ts           All TypeScript types matching FastAPI models
└── middleware.ts            Auth guard — redirects unauthenticated users
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Connect to FastAPI backend

Make sure your FastAPI backend is running on port 8000:

```bash
cd ../backendapi
uvicorn main:app --reload --port 8000
```

## Pages

| Route                         | Description                          | Auth |
|-------------------------------|--------------------------------------|------|
| `/auth/login`                 | RS256 JWT login                      | No   |
| `/dashboard`                  | Overview — score, gaps, actions      | Yes  |
| `/dashboard/assessment`       | Full rule breakdown + gap details    | Yes  |
| `/dashboard/consent`          | Consent records — capture/withdraw   | Yes  |
| `/dashboard/dsr`              | DSR lifecycle + 30-day SLA clock     | Yes  |
| `/dashboard/breaches`         | Breach 72hr countdown + notification | Yes  |
| `/dashboard/certificates`     | Issue, verify, download certs        | Yes  |
| `/dashboard/data-map`         | Data inventory + PII scanner         | Yes  |
| `/dashboard/audit`            | Immutable audit trail + export       | Yes  |

## Connecting to Real API

All pages use mock data by default. To connect to your FastAPI backend:

1. All API methods are in `lib/api.ts` — fully typed
2. Replace mock arrays in each page with `useFetch(() => assessmentApi.getLatest())`
3. Replace form handlers with `useMutation(() => dsrApi.submit(data))`

Example:
```tsx
// Before (mock)
const [dsrs, setDSRs] = useState(MOCK_DSRS)

// After (real API)
const { data, loading, refetch } = useFetch(() => dsrApi.list())
const dsrs = data?.items ?? []
```

## Build for Production

```bash
npm run build
npm start
```

## Type Check

```bash
npm run type-check
```

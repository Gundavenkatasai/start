# OpenBench — Master Engineering Architecture & Protocol (Part 2)

> **Technical Architecture, Zero-Drift Financial Mathematics, API Design & Safe Modification Protocol**  
> *Production Monorepo: React 19 + TypeScript + Vite + Express + Prisma ORM + Multi-Currency Escrow*

---

## 1. Monorepo Organization

```
startup/
├── package.json                 # Workspaces root ("server", "client")
├── docker-compose.yml           # Multi-container orchestration (PostgreSQL 16, API, Nginx)
├── docs/
│   ├── OPERATIONAL_WORKFLOW.md  # Part 1: Operations SOP & 6-Stage Lifecycle
│   └── ENGINEERING_GUIDE.md     # Part 2: Engineering Architecture & Dev Protocol
├── server/                      # Express + TypeScript Modular REST API
│   ├── prisma/
│   │   ├── schema.prisma        # SQLite development database (dev.db)
│   │   ├── schema.postgresql.prisma # PostgreSQL production database
│   │   └── seed.ts              # Idempotent realistic collective seeder
│   └── src/
│       ├── services/
│       │   ├── mathEngine.ts    # Zero floating-point Largest Remainder engine
│       │   ├── paymentService.ts# Unified Stripe (USD/GBP/EUR) + Razorpay (INR) + Sandbox
│       │   ├── emailService.ts  # Transactional emails & dev preview logger
│       │   └── storageService.ts# Deliverables & SOW local/S3 storage
│       ├── middleware/
│       │   ├── auth.ts          # JWT (15m) + HttpOnly refresh cookie (7d) + RBAC
│       │   ├── validate.ts      # Zod schema request validation
│       │   └── rateLimiter.ts   # Express IP rate limiting
│       ├── controllers/         # Layered business logic controllers
│       ├── routes/              # Explicit RBAC protected routes
│       └── scripts/
│           └── simulateWorkflow.ts # 11-step complete happy path simulator
└── client/                      # React 19 + TypeScript + Vite + Tailwind CSS SPA
    ├── vite.config.ts           # Dev proxy to :5000 & allowedHosts: true for ngrok
    └── src/
        ├── types/index.ts       # Shared TypeScript model definitions
        ├── lib/
        │   ├── api.ts           # Authenticated fetch wrapper with token injection
        │   └── formatters.ts    # Currency minor-unit formatter with zero layout shift
        ├── context/
        │   └── AuthContext.tsx  # User session & 1-click demo persona switcher
        ├── components/          # Radix/Tailwind accessible components
        └── pages/               # Role-separated route trees (Admin, Talent, Client)
```

---

## 2. Zero-Floating-Point Financial Mathematics

### The Problem
JavaScript floating-point arithmetic introduces rounding leakage (e.g., `0.1 + 0.2 === 0.30000000000000004`). In an open-book collective, missing cents or paise destroy trust between founders and contractors.

### The Solution: Largest Remainder Method (Hare-Niemeyer)
All amounts are stored as **integers in minor units** (cents, pence, paise). When distributing an uneven amount across percentage splits:

1. Compute exact floating-point quota for each party:
   $$Q_i = \frac{T \times P_i}{100}$$
2. Take the integer floor: $F_i = \lfloor Q_i \rfloor$.
3. Compute the remainder: $R_i = Q_i - F_i$.
4. Calculate the unallocated remainder minor units:
   $$K = T - \sum_{i=1}^N F_i$$
5. Rank all recipients by $R_i$ descending and assign $+1$ minor unit to the top $K$ recipients.

**Mathematical Proof**:
$$\sum_{i=1}^N \text{Allocated}_i \equiv T \quad (\forall T \in \mathbb{Z}^+, \sum P_i = 100)$$

*Reference Implementation:* [`server/src/services/mathEngine.ts`](file:///c:/Users/venka/OneDrive/Desktop/startup/server/src/services/mathEngine.ts#L56-L106).

---

## 3. Database Schema Synchronisation Protocol

The codebase uses a dual-database pattern:
- **Local Dev**: Zero-configuration **SQLite** (`server/prisma/schema.prisma` $\rightarrow$ `server/dev.db`).
- **Production**: **PostgreSQL 16** (`server/prisma/schema.postgresql.prisma` $\rightarrow$ Docker / Cloud).

### Schema Change Procedure
When modifying any model:
1. Update `server/prisma/schema.prisma`.
2. Update `server/prisma/schema.postgresql.prisma` to match.
3. Apply to local SQLite database:
   ```powershell
   npm --prefix server run prisma:push
   ```
4. Regenerate the Prisma Client TypeScript types:
   ```powershell
   npm --prefix server run prisma:generate
   ```

---

## 4. API Endpoints & RBAC Protection

| Route Prefix | Access Level | Description |
| :--- | :--- | :--- |
| `/api/public/*` | Public | Landing page stats, public budget calculator, availability ping confirm. |
| `/api/auth/*` | Public / Token | Registration, login, refresh token rotation, logout. |
| `/api/admin/*` | `Role === "ADMIN"` | Talent CRM vetting, scoping, pod assembly, QA gate, payout release, CSV export. |
| `/api/talent/*`| `Role === "TALENT"`| Dashboard, availability toggle, open-book SOW e-sign, deliverable upload, payout receipts. |
| `/api/client/*`| `Role === "CLIENT"`| Brief submission, project dashboard, milestone deposit checkout, deliverable review. |
| `/api/webhooks/*`| Webhook Signature | Stripe (`stripe-signature`) and Razorpay (`x-razorpay-signature`) with idempotent replay protection. |

---

## 5. Automated Verification Checklist

Always run the full verification pipeline before deploying or opening a PR:

```powershell
# 1. Run math engine & 11-step lifecycle integration tests
npm test

# 2. Run live operational simulation
npm run simulate

# 3. Check TypeScript compilation on backend and frontend
npm run typecheck

# 4. Build production bundles
npm run build
```

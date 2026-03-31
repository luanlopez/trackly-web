# Trackly — Web Dashboard

Trackly is a job application tracker. This repository contains the web dashboard — the frontend interface where users manage and monitor their job applications.

It is part of a broader system that includes a REST API ([trackly-api](../trackly-api)) and a Chrome extension that extracts job data directly from LinkedIn.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui + Radix UI (Base UI) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Theming | next-themes |
| Notifications | Sonner |
| Auth | JWT Bearer via HTTP-only cookie |

---

## Features

- User authentication (login, register, forgot password)
- Protected dashboard with route-level middleware
- Job applications table with status tracking
- Application statuses: `not_applied`, `applied`, `interviewing`, `offered`, `rejected`, `accepted`
- Job statuses: `open`, `closed`, `archived`
- Role-based access (`user`, `admin`)
- Server-side API calls with automatic token injection

---

## Project Structure

```
src/
  app/
    (auth)/         # Login, register, forgot-password pages
    (dashboard)/    # Protected dashboard pages
    api/            # Next.js route handlers
  components/
    features/       # Domain-specific components (JobsTable, DashboardHeader)
    providers/      # Context providers
    ui/             # Shared UI primitives (shadcn)
  contexts/         # React context (AuthContext, LocaleContext)
  hooks/            # Custom hooks
  lib/              # Utility functions (cn, etc.)
  services/         # API client (apiFetch wrapper)
  types/            # Shared TypeScript types and interfaces
  middleware.ts     # Auth guard — redirects unauthenticated users
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- The [trackly-api](../trackly-api) running locally (default: `http://localhost:3000`)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file at the root:

```env
API_URL=http://localhost:3000
```

> `API_URL` is used server-side by the Next.js API layer to proxy requests to the backend. Defaults to `http://localhost:3000` if not set.

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Authentication Flow

1. User submits credentials on `/login`.
2. The API returns a JWT `accessToken`.
3. The token is stored in an HTTP-only cookie (`access_token`).
4. `middleware.ts` enforces route protection on every request:
   - Unauthenticated users are redirected to `/login` with a `callbackUrl`.
   - Authenticated users visiting auth pages are redirected to `/dashboard`.
5. Server components read the token from cookies and attach it as a `Bearer` header on all API calls.

---

## Related Repositories

| Repository | Description |
|---|---|
| `trackly-api` | Node.js REST API (Fastify + Prisma) |
| `trackly-extension` | Chrome Extension (Manifest V3) for LinkedIn integration |

---

## License

Private — all rights reserved.

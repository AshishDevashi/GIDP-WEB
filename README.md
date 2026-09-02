# GIDP — Internal Developer Portal

Next.js 16 (App Router) + TypeScript + Tailwind v4 boilerplate for an Internal Developer Portal.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS v4** with CSS-variable theming and `next-themes` dark mode
- **TanStack React Query** (+ Devtools) for server state
- **Axios** API client with normalized error handling
- **Zustand** for UI state
- **Zod** for schema validation (API responses + env)
- **React Hook Form** + `@hookform/resolvers` for forms
- **Radix UI** primitives, **lucide-react** icons, **sonner** toasts
- **ESLint** + **Prettier** (with Tailwind class sorting)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 — unauthenticated users land on `/auth` (Login / Register tabs), authenticated users on `/dashboard`.

## Backend configuration

The Go backend is expected at `NEXT_PUBLIC_API_URL` with a versioned prefix:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1
```

Requests resolve to `http://localhost:8080/api/v1/<endpoint>`. Bump `NEXT_PUBLIC_API_VERSION` to `v2` to move the whole client — no code changes. The resolved base URL lives in `env.API_BASE_URL` ([src/lib/env.ts](src/lib/env.ts)).

## Auth

- `POST /auth/login` → `{ email, password }`
- `POST /auth/register` → `{ username, email, password }`

The token from the response is stored in the `gidp_token` cookie ([src/lib/auth-token.ts](src/lib/auth-token.ts)), attached as `Authorization: Bearer <token>` by the axios request interceptor, and read by [src/proxy.ts](src/proxy.ts) to guard every non-public route. A `401` clears the token and redirects to `/auth`.

> The cookie is JS-readable so the proxy and client share one source of truth. Switch to a backend-set `HttpOnly` cookie when available.

## Scripts

| Script              | Description      |
| ------------------- | ---------------- |
| `npm run dev`       | Start dev server |
| `npm run build`     | Production build |
| `npm start`         | Run built app    |
| `npm run lint`      | Lint             |
| `npm run typecheck` | TypeScript check |
| `npm run format`    | Prettier format  |

## Structure

```
src/
  app/
    (portal)/            # Protected portal shell (sidebar + header)
      dashboard/
    auth/                # Login / Register tabs
    layout.tsx           # Root layout + providers
  components/
    layout/              # Sidebar, Header, PageHeader
    providers/           # Theme, React Query, combined AppProviders
    ui/                  # Button, Card, Input, Tabs, Field, ...
  config/nav.ts          # Site config + navigation items (empty by default)
  features/
    auth/                # Schemas, api, mutations, forms
  lib/                   # api-client, auth-token, env, utils
  proxy.ts               # Route protection + "/" redirect
  store/                 # Zustand auth + UI state
```

## Adding a feature

1. Create `src/features/<feature>/` with `types.ts` (Zod schemas), `api.ts` (axios calls), `hooks.ts` (React Query hooks) and `components/`.
2. Add a route under `src/app/(portal)/<feature>/` and a nav entry in `src/config/nav.ts`.

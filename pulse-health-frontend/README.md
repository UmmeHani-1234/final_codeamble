# Pulse — Health Network Frontend

A React (Vite + Tailwind) frontend with two role-scoped dashboards:

- **Hospital Dashboard** (`/hospital`) — for a single hospital that has
  registered on the platform. Every screen is scoped to *that hospital's own
  data only* (its own alerts, its own submissions, its own profile).
- **Admin Dashboard** (`/admin`) — the network operator's view, aggregating
  data across **every** registered hospital (organizations table, network-wide
  alerts, regional risk comparison, system health).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## How the two dashboards are separated

- `src/context/AuthContext.jsx` is the mock auth + data layer. It holds:
  - `hospitals` — every registered hospital (admin sees all of these)
  - `alertsByHospital` — alerts keyed by hospital id
  - `currentHospital` / `currentAlerts` — automatically scoped to whichever
    hospital is currently logged in
- `src/routes/ProtectedRoute.jsx` gates `/hospital/*` and `/admin/*` by role,
  so a hospital user is redirected away from admin routes and vice versa.
- Replace the functions in `AuthContext.jsx` (`loginAsHospital`,
  `registerHospital`, `submitSurveillanceData`, etc.) with real API calls
  when a backend exists — the shape of the returned data is designed to map
  directly onto typical REST/GraphQL responses.

## Flow

1. **`/`** — public marketing site
2. **`/register`** — a hospital registers itself → creates a new hospital
   record → logs the user in as that hospital → redirects to `/hospital`
3. **`/login`** — existing hospitals sign in (pick from registered hospitals
   in this demo), or continue as the network admin
4. **`/hospital`** — Overview, Alerts, Alert detail/review, Submit Data,
   History, Notifications, Settings — all scoped to one hospital
5. **`/admin`** — Overview, All Alerts, Regional View, Organizations,
   History & Reports, Notifications, Settings — all network-wide

## Project structure

```
src/
  context/AuthContext.jsx      mock auth + data scoping
  data/mockData.js             seed hospitals, alerts, chart data
  routes/ProtectedRoute.jsx    role-based route guard
  components/
    ui/                        Badge, KpiCard, EmptyState, PulseLine
    layout/                    Sidebar, TopHeader, DashboardLayout
  pages/
    public/                    Home, Login, RegisterHospital
    hospital/                  Overview, Alerts, AlertDetail, SubmitData, History, Notifications, Settings
    admin/                     Overview, Alerts, Regional, Organizations, History, Notifications, Settings
  App.jsx                      route tree
  main.jsx                     app entry
  index.css                    Tailwind + design-system component classes
```

## Design system

Defined in `tailwind.config.js` (colors, fonts, shadows) and `src/index.css`
(`@layer components` for `.card`, `.btn-*`, `.badge-*`, etc.) — light,
premium healthcare-SaaS look: off-white background, white soft-shadow cards,
one confident blue accent, Fraunces for display type + Inter for UI,
soft-tint status badges.

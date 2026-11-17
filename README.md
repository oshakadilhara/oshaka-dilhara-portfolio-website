# Oshaka Dilhara — Technology Portal

**Technology. Intelligence. Innovation.**  
**Explore. Learn. Build.**

Production-ready personal technology ecosystem built with **Next.js**, **TypeScript**, **Supabase**, and **Vercel**.

## What this platform includes

- Professional portfolio
- Technology blog
- Free online tools
- AI playground
- Learning, research and architecture hubs
- Resources, career and CloudCey showcases
- Private single-admin dashboard

Public pages and free tools work **without visitor registration**.

## Stack

- Next.js App Router (hosted on Vercel)
- React + TypeScript + Tailwind CSS + shadcn/ui + Motion
- Supabase PostgreSQL, Auth, Storage + RLS
- Vitest + Playwright (testing phases)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Supabase environment variables are required for auth/data features (Phases 7–9). The Phase 1 UI shell runs without them.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Documentation

- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [.env.example](./.env.example)

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the repo in Vercel (Framework: Next.js).
3. Set environment variables from `.env.example`.
4. Connect production branch `main`.
5. Add custom domain `oshakadilhara.com` using the DNS records Vercel provides.

Detailed production checklist arrives in Phase 11.

## Identity

**OSHAKA DILHARA**  
Technology. Intelligence. Innovation.  
Explore. Learn. Build.

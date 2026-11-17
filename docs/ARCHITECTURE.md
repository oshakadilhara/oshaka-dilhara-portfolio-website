# Architecture — Oshaka Dilhara Technology Portal

## Stack

| Layer | Choice |
| --- | --- |
| Application | Next.js App Router on Vercel |
| UI | React, TypeScript, Tailwind CSS, shadcn/ui, Motion |
| Data | Supabase PostgreSQL + Auth + Storage |
| Hosting | Vercel (application), Supabase (managed services) |

## Principles

1. Vercel hosts the entire Next.js application (pages, Server Actions, Route Handlers).
2. Supabase is the managed database/auth/storage provider — not a separately deployed app backend.
3. Public pages and free tools require no visitor login.
4. Only an allowlisted administrator can authenticate into `/admin`.
5. Authorization is enforced server-side and with PostgreSQL RLS.

## Application structure

```
src/
  app/
    (public)/     # Marketing, portfolio, tools, labs
    admin/        # Private administrator surfaces
    api/          # Route Handlers
  components/     # Shared UI and layout
  features/       # Domain modules
  lib/            # Supabase, auth, seo, validation
supabase/
  migrations/     # SQL schema + RLS
```

## Route notes

- Tool categories use `/tools/category/[slug]` because Next.js cannot host two sibling dynamic segments (`/tools/[category]` and `/tools/[slug]`) at the same path depth.
- Individual tools remain at `/tools/[slug]`.

## Delivery phases

1. Design system and shell
2. Homepage and portfolio
3. Blog
4. First 20 tools
5. AI labs
6. Learning / research / architecture
7. Supabase schema
8. Admin auth + RLS
9. Admin dashboard
10. Testing / SEO / performance
11. Vercel production deployment

---
title: "Next.js on Vercel with Supabase"
description: "How to think about application hosting on Vercel while using Supabase for data, auth and storage."
publishedAt: "2026-11-05"
category: "software-engineering"
tags: ["nextjs", "vercel", "supabase"]
status: "published"
featured: true
---

# Next.js on Vercel with Supabase

A clean modern stack keeps the application and the managed data platform clearly separated.

## Application layer

Next.js on Vercel owns:

- Pages and layouts
- Server Components
- Server Actions
- Route Handlers

Vercel functions are request-driven. Prefer browser-side processing for free tools and avoid assuming long-running background servers.

## Data layer

Supabase owns:

- PostgreSQL
- Auth
- Storage
- Row Level Security

That means Supabase is not a separately deployed application backend. It is the managed service layer your Next.js app talks to.

## Security baseline

- Keep secret keys server-only
- Enforce authorization in Server Actions and Route Handlers
- Enable RLS on every application table
- Never trust frontend-only auth checks for admin operations

## Practical takeaway

Use Vercel for the product surface. Use Supabase for durable state. Keep the boundary intentional.

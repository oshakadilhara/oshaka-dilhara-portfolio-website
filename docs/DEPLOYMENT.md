# Deployment notes (Phase 11 draft)

## Hosting model

- **Vercel** hosts the full Next.js application.
- **Supabase** provides PostgreSQL, Auth and Storage.
- **GitHub** is the source of truth for Vercel deployments.

## Environment variables

Copy `.env.example` into:

- Local: `.env.local`
- Vercel Preview
- Vercel Production

Keep development and production Supabase projects separate when practical.

Never commit secrets.

## Custom domain

Configure `oshakadilhara.com` in the Vercel project domains UI and apply the DNS records Vercel displays. Prefer apex + `www` redirect consistency.

Admin remains under `/admin` on the primary domain unless a dedicated subdomain is later required.

## Production branch

- Production branch: `main`
- Pull requests create Preview deployments
- Failed builds must not promote

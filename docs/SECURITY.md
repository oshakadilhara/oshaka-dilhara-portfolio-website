# Security — Oshaka Dilhara Technology Portal

## Threat model (summary)

| Asset | Risk | Control |
| --- | --- | --- |
| Admin CMS | Account takeover / unauthorized writes | Allowlisted `ADMIN_EMAILS`, proxy gate, `RequireAdmin` layout, login rate limit, Supabase Auth |
| Contact inbox | Spam / abuse | Zod validation, honeypot, IP rate limit, hashed IP storage, RLS insert-only for public |
| Database | Anon key abuse | RLS on every table; anon cannot UPDATE/DELETE content or read messages |
| Media storage | Malicious uploads | Admin-only write policies, MIME allowlist, 5MB limit |
| XSS | Injected HTML/MD | `react-markdown` without raw HTML; link sanitization; escaped local MD preview |
| Open redirects | Phishing after login | `safeAdminNextPath` |

## Environment matrix

| Variable | Exposure | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Anon/publishable; protected by RLS |
| `ADMIN_EMAILS` | Server | Comma-separated allowlist |
| `SUPABASE_SECRET_KEY` | Server only | Prefer not using in app code; never ship to browser |
| `DATABASE_URL` | Server / CLI only | Migrations tooling |

## Operator checklist

1. Disable public signup in Supabase Auth.
2. Create the owner Auth user manually.
3. Apply `supabase/migrations/20261117120000_security_baseline.sql`.
4. Insert the owner into `public.admin_users` (see migration notes).
5. Keep `ADMIN_EMAILS` in sync with that email on Vercel.
6. Confirm contact form inserts succeed and anon cannot `SELECT` messages.
7. Rotate keys if a secret was ever committed or shared.

## Rate limiting

Login and contact use an in-process sliding window. On multi-instance serverless this is best-effort. Prefer Upstash/Vercel KV when traffic grows.

## Reporting

Security issues: email the site contact address privately. Do not open public issues with exploit details.

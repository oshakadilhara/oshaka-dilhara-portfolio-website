# Administrator setup

Only one allowlisted owner can access `/admin`.

Public registration is disabled. Visitors never create accounts.

## 1. Configure the allowlist

In `.env.local`:

```env
ADMIN_EMAILS=you@example.com
```

Use a comma-separated list only if you intentionally need more than one owner email.

Restart the Next.js dev server after changing env vars.

## 2. Create the Auth user in Supabase

1. Open the Supabase project dashboard.
2. Go to **Authentication → Users**.
3. Click **Add user**.
4. Choose **Create new user**.
5. Enter the **same email** as `ADMIN_EMAILS`.
6. Set a strong password.
7. Prefer **auto-confirm** so the account can sign in immediately.

Do not enable public signup for this project.

## 3. Auth settings recommendations

In **Authentication → Providers → Email**:

- Keep email/password enabled.
- Disable public sign-ups if the option is available.
- Do not publish a visitor registration page in this app.

## 4. Sign in

Open:

[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Use the allowlisted email and password.

Unauthorized authenticated users are rejected server-side and signed out.

## 5. Apply RLS + admin_users

1. Run these migrations in the Supabase SQL editor (in order):
   - `supabase/migrations/20261117120000_security_baseline.sql`
   - `supabase/migrations/20261117150000_admin_cms.sql`
2. Insert the Auth user into `public.admin_users` (see migration footer / `supabase/seed.sql`).
3. App allowlisting (`ADMIN_EMAILS`) and DB `is_admin()` must both recognize the owner.

Without step 2, public contact inserts still work, but admin CMS/inbox reads via RLS will fail.

## 5b. Admin CMS surfaces

After migrations + `admin_users` seeding, sign in at `/admin/login` and use:

- Dashboard counts
- Articles / projects CRUD
- Tools metadata overlays
- Resources / research / architecture / learning entries
- Categories
- Messages + feedback inboxes
- Analytics events
- Settings (site profile, experience, education, certifications)

## 6. Production

Add the same variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`
- `SUPABASE_SECRET_KEY` only if genuinely required later
- `DATABASE_URL` only for trusted server/migration tooling

Never commit secrets.

-- Phase 9: extend CMS tables for full admin dashboard.

-- ---------------------------------------------------------------------------
-- Article / project enrichments
-- ---------------------------------------------------------------------------

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cover_url text;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS stack text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS href text,
  ADD COLUMN IF NOT EXISTS lifecycle text NOT NULL DEFAULT 'in-progress'
    CHECK (lifecycle IN ('concept', 'in-progress', 'completed', 'maintained')),
  ADD COLUMN IF NOT EXISTS cloudcey boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- Content hubs (resources / research / architecture / learning)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.content_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL CHECK (section IN ('resources', 'research', 'architecture', 'learning')),
  slug text NOT NULL,
  title text NOT NULL,
  summary text,
  body_md text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section, slug)
);

CREATE INDEX IF NOT EXISTS content_entries_section_idx ON public.content_entries (section, status);

-- ---------------------------------------------------------------------------
-- Portfolio history
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  location text,
  start_label text NOT NULL,
  end_label text NOT NULL,
  summary text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  credential text NOT NULL,
  field text,
  start_label text,
  end_label text,
  summary text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  issued_label text,
  credential_id text,
  url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Tool metadata overlays (code catalog remains source of tool UIs)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tool_meta (
  slug text PRIMARY KEY,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Lightweight analytics
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 80),
  path text CHECK (path IS NULL OR char_length(path) <= 300),
  referrer text CHECK (referrer IS NULL OR char_length(referrer) <= 500),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON public.analytics_events (event_name);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS content_entries_select_published ON public.content_entries;
CREATE POLICY content_entries_select_published
  ON public.content_entries FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS content_entries_write_admin ON public.content_entries;
CREATE POLICY content_entries_write_admin
  ON public.content_entries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS experience_select_published ON public.experience;
CREATE POLICY experience_select_published
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS experience_write_admin ON public.experience;
CREATE POLICY experience_write_admin
  ON public.experience FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS education_select_published ON public.education;
CREATE POLICY education_select_published
  ON public.education FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS education_write_admin ON public.education;
CREATE POLICY education_write_admin
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS certifications_select_published ON public.certifications;
CREATE POLICY certifications_select_published
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS certifications_write_admin ON public.certifications;
CREATE POLICY certifications_write_admin
  ON public.certifications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS tool_meta_select_public ON public.tool_meta;
CREATE POLICY tool_meta_select_public
  ON public.tool_meta FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS tool_meta_write_admin ON public.tool_meta;
CREATE POLICY tool_meta_write_admin
  ON public.tool_meta FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS analytics_insert_public ON public.analytics_events;
CREATE POLICY analytics_insert_public
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(event_name) BETWEEN 1 AND 80
    AND (path IS NULL OR char_length(path) <= 300)
  );

DROP POLICY IF EXISTS analytics_select_admin ON public.analytics_events;
CREATE POLICY analytics_select_admin
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS analytics_delete_admin ON public.analytics_events;
CREATE POLICY analytics_delete_admin
  ON public.analytics_events FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS feedback_delete_admin ON public.feedback;
CREATE POLICY feedback_delete_admin
  ON public.feedback FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Allow public read of the published site profile setting only.
DROP POLICY IF EXISTS settings_select_public_profile ON public.site_settings;
CREATE POLICY settings_select_public_profile
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (key = 'profile' OR public.is_admin());

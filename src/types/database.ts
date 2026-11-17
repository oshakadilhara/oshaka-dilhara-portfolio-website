export type PublishStatus = "draft" | "published" | "archived";
export type MessageStatus = "new" | "read" | "archived" | "spam";
export type FeedbackStatus = "new" | "reviewed" | "archived";
export type CategoryKind = "blog" | "tool" | "resource" | "project";
export type ContentSection = "resources" | "research" | "architecture" | "learning";
export type ProjectLifecycle = "concept" | "in-progress" | "completed" | "maintained";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  status: MessageStatus;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type FeedbackRow = {
  id: string;
  rating: number | null;
  message: string;
  page_path: string | null;
  status: FeedbackStatus;
  ip_hash: string | null;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: CategoryKind;
  created_at: string;
};

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  status: PublishStatus;
  published_at: string | null;
  category_id: string | null;
  tags: string[];
  featured: boolean;
  cover_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body_md: string;
  status: PublishStatus;
  featured: boolean;
  published_at: string | null;
  stack: string[];
  href: string | null;
  lifecycle: ProjectLifecycle;
  cloudcey: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentEntryRow = {
  id: string;
  section: ContentSection;
  slug: string;
  title: string;
  summary: string | null;
  body_md: string;
  status: PublishStatus;
  sort_order: number;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_label: string;
  end_label: string;
  summary: string;
  highlights: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EducationRow = {
  id: string;
  institution: string;
  credential: string;
  field: string | null;
  start_label: string | null;
  end_label: string | null;
  summary: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CertificationRow = {
  id: string;
  name: string;
  issuer: string;
  issued_label: string | null;
  credential_id: string | null;
  url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ToolMetaRow = {
  slug: string;
  featured: boolean;
  published: boolean;
  notes: string | null;
  sort_order: number;
  updated_at: string;
  updated_by: string | null;
};

export type SiteSettingRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
};

export type AnalyticsEventRow = {
  id: string;
  event_name: string;
  path: string | null;
  referrer: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

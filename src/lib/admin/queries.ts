import { createClient } from "@/lib/supabase/server";
import type {
  AnalyticsEventRow,
  ArticleRow,
  CategoryRow,
  CertificationRow,
  ContactMessageRow,
  ContentEntryRow,
  ContentSection,
  EducationRow,
  ExperienceRow,
  FeedbackRow,
  ProjectRow,
  SiteSettingRow,
  ToolMetaRow,
} from "@/types/database";

async function adminClient() {
  return createClient();
}

export async function getDashboardStats() {
  const supabase = await adminClient();
  const [
    messages,
    feedback,
    articles,
    projects,
    categories,
    content,
    events,
  ] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("content_entries")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    newMessages: messages.count ?? 0,
    newFeedback: feedback.count ?? 0,
    publishedArticles: articles.count ?? 0,
    publishedProjects: projects.count ?? 0,
    categories: categories.count ?? 0,
    publishedContent: content.count ?? 0,
    analyticsEvents: events.count ?? 0,
    errors: [
      messages.error?.message,
      feedback.error?.message,
      articles.error?.message,
      projects.error?.message,
      categories.error?.message,
      content.error?.message,
      events.error?.message,
    ].filter(Boolean) as string[],
  };
}

export async function listMessages(limit = 100) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { rows: (data ?? []) as ContactMessageRow[], error: error?.message };
}

export async function listFeedback(limit = 100) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { rows: (data ?? []) as FeedbackRow[], error: error?.message };
}

export async function listCategories() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: true });
  return { rows: (data ?? []) as CategoryRow[], error: error?.message };
}

export async function listArticles() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  return { rows: (data ?? []) as ArticleRow[], error: error?.message };
}

export async function getArticle(id: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { row: (data as ArticleRow | null) ?? null, error: error?.message };
}

export async function listProjects() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  return { rows: (data ?? []) as ProjectRow[], error: error?.message };
}

export async function getProject(id: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { row: (data as ProjectRow | null) ?? null, error: error?.message };
}

export async function listContentEntries(section: ContentSection) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  return { rows: (data ?? []) as ContentEntryRow[], error: error?.message };
}

export async function getContentEntry(id: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { row: (data as ContentEntryRow | null) ?? null, error: error?.message };
}

export async function listExperience() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return { rows: (data ?? []) as ExperienceRow[], error: error?.message };
}

export async function listEducation() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return { rows: (data ?? []) as EducationRow[], error: error?.message };
}

export async function listCertifications() {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return { rows: (data ?? []) as CertificationRow[], error: error?.message };
}

export async function listToolMeta() {
  const supabase = await adminClient();
  const { data, error } = await supabase.from("tool_meta").select("*");
  return { rows: (data ?? []) as ToolMetaRow[], error: error?.message };
}

export async function getSiteSetting(key: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  return { row: (data as SiteSettingRow | null) ?? null, error: error?.message };
}

export async function listAnalyticsEvents(limit = 100) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { rows: (data ?? []) as AnalyticsEventRow[], error: error?.message };
}

export async function getAnalyticsSummary() {
  const supabase = await adminClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_name, path, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1000);

  const rows = data ?? [];
  const byName = new Map<string, number>();
  const byPath = new Map<string, number>();
  for (const row of rows) {
    byName.set(row.event_name, (byName.get(row.event_name) ?? 0) + 1);
    if (row.path) byPath.set(row.path, (byPath.get(row.path) ?? 0) + 1);
  }

  return {
    weekTotal: rows.length,
    byName: [...byName.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    byPath: [...byPath.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    error: error?.message,
  };
}

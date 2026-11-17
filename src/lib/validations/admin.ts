import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

export const publishStatusSchema = z.enum(["draft", "published", "archived"]);
export const messageStatusSchema = z.enum(["new", "read", "archived", "spam"]);
export const feedbackStatusSchema = z.enum(["new", "reviewed", "archived"]);
export const categoryKindSchema = z.enum(["blog", "tool", "resource", "project"]);
export const contentSectionSchema = z.enum([
  "resources",
  "research",
  "architecture",
  "learning",
]);
export const projectLifecycleSchema = z.enum([
  "concept",
  "in-progress",
  "completed",
  "maintained",
]);

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  kind: categoryKindSchema,
});

export const articleSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  body_md: z.string().max(200_000),
  status: publishStatusSchema,
  category_id: z.string().uuid().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  featured: z.boolean(),
  cover_url: z.string().trim().max(500).optional().or(z.literal("")),
});

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  body_md: z.string().max(100_000),
  status: publishStatusSchema,
  featured: z.boolean(),
  stack: z.array(z.string().trim().min(1).max(40)).max(30),
  href: z.string().trim().max(500).optional().or(z.literal("")),
  lifecycle: projectLifecycleSchema,
  cloudcey: z.boolean(),
});

export const contentEntrySchema = z.object({
  id: z.string().uuid().optional(),
  section: contentSectionSchema,
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  body_md: z.string().max(100_000),
  status: publishStatusSchema,
  sort_order: z.coerce.number().int().min(0).max(10_000),
});

export const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  start_label: z.string().trim().min(1).max(40),
  end_label: z.string().trim().min(1).max(40),
  summary: z.string().trim().max(2000),
  highlights: z.array(z.string().trim().min(1).max(240)).max(20),
  sort_order: z.coerce.number().int().min(0).max(10_000),
  published: z.boolean(),
});

export const educationSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().trim().min(1).max(160),
  credential: z.string().trim().min(1).max(160),
  field: z.string().trim().max(160).optional().or(z.literal("")),
  start_label: z.string().trim().max(40).optional().or(z.literal("")),
  end_label: z.string().trim().max(40).optional().or(z.literal("")),
  summary: z.string().trim().max(1000).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(10_000),
  published: z.boolean(),
});

export const certificationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(160),
  issued_label: z.string().trim().max(40).optional().or(z.literal("")),
  credential_id: z.string().trim().max(120).optional().or(z.literal("")),
  url: z.string().trim().max(500).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(10_000),
  published: z.boolean(),
});

export const toolMetaSchema = z.object({
  slug: slugSchema,
  featured: z.boolean(),
  published: z.boolean(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(10_000),
});

export const siteProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  headline: z.string().trim().min(1).max(200),
  shortBio: z.string().trim().min(1).max(500),
  longBio: z.string().trim().max(5000),
  focusAreas: z.array(z.string().trim().min(1).max(80)).max(20),
  availabilityNote: z.string().trim().max(300),
});

export const idSchema = z.string().uuid();

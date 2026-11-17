import {
  caseStudies,
  certifications as staticCertifications,
  education as staticEducation,
  experiences as staticExperiences,
  profileContent,
  projects as staticProjects,
  skills,
} from "@/features/portfolio/data/content";
import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  Education,
  Experience,
  ProfileContent,
  Project,
} from "@/types/portfolio";

export async function getProfile(): Promise<ProfileContent> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "profile")
      .maybeSingle();

    const value = data?.value as Partial<ProfileContent> | undefined;
    if (!value?.name || !value.headline || !value.shortBio) {
      return profileContent;
    }

    return {
      name: value.name,
      headline: value.headline,
      shortBio: value.shortBio,
      longBio: Array.isArray(value.longBio)
        ? value.longBio
        : profileContent.longBio,
      focusAreas: Array.isArray(value.focusAreas)
        ? value.focusAreas
        : profileContent.focusAreas,
      availabilityNote:
        value.availabilityNote || profileContent.availabilityNote,
    };
  } catch {
    return profileContent;
  }
}

async function fetchPublishedProjects(): Promise<Project[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error || !data?.length) return null;

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary || "",
      description: row.body_md || row.summary || "",
      status: row.lifecycle,
      stack: row.stack ?? [],
      featured: row.featured,
      href: row.href ?? undefined,
      cloudcey: row.cloudcey,
    }));
  } catch {
    return null;
  }
}

export async function getAllProjects() {
  return (await fetchPublishedProjects()) ?? staticProjects;
}

export async function getFeaturedProjects() {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getSkills() {
  return skills;
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticExperiences;

    return data.map((row) => ({
      id: row.id,
      company: row.company,
      role: row.role,
      location: row.location ?? undefined,
      startLabel: row.start_label,
      endLabel: row.end_label,
      summary: row.summary,
      highlights: row.highlights ?? [],
    }));
  } catch {
    return staticExperiences;
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticEducation;

    return data.map((row) => ({
      id: row.id,
      institution: row.institution,
      credential: row.credential,
      field: row.field ?? undefined,
      startLabel: row.start_label ?? undefined,
      endLabel: row.end_label ?? undefined,
      summary: row.summary ?? undefined,
    }));
  } catch {
    return staticEducation;
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticCertifications;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      issuer: row.issuer,
      issuedLabel: row.issued_label ?? undefined,
      credentialId: row.credential_id ?? undefined,
      url: row.url ?? undefined,
    }));
  } catch {
    return staticCertifications;
  }
}

export function getCaseStudies() {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((study) => study.slug === slug) ?? null;
}

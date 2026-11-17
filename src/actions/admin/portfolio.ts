"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { splitList } from "@/lib/admin/slug";
import { sanitizeHref, sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import {
  certificationSchema,
  educationSchema,
  experienceSchema,
  idSchema,
} from "@/lib/validations/admin";

function boolFromForm(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function revalidatePortfolio() {
  revalidatePath("/admin/settings");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/experience");
  revalidatePath("/portfolio/education");
  revalidatePath("/portfolio/certifications");
}

export async function saveExperience(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const parsed = experienceSchema.safeParse({
    id: formData.get("id") || undefined,
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location") || "",
    start_label: formData.get("start_label"),
    end_label: formData.get("end_label"),
    summary: formData.get("summary") || "",
    highlights: splitList(formData.get("highlights")),
    sort_order: formData.get("sort_order") || 0,
    published: boolFromForm(formData.get("published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid experience." };
  }

  const payload = {
    company: sanitizePlainText(parsed.data.company, 120),
    role: sanitizePlainText(parsed.data.role, 120),
    location: sanitizePlainText(parsed.data.location || "", 120) || null,
    start_label: sanitizePlainText(parsed.data.start_label, 40),
    end_label: sanitizePlainText(parsed.data.end_label, 40),
    summary: sanitizePlainText(parsed.data.summary, 2000),
    highlights: parsed.data.highlights.map((item) =>
      sanitizePlainText(item, 240)
    ),
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
    updated_at: new Date().toISOString(),
  };

  const query = parsed.data.id
    ? ctx.supabase.from("experience").update(payload).eq("id", parsed.data.id)
    : ctx.supabase.from("experience").insert(payload);

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "experience.update" : "experience.create",
    entityType: "experience",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Experience saved." };
}

export async function deleteExperience(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid experience id." };

  const { error } = await ctx.supabase
    .from("experience")
    .delete()
    .eq("id", id.data);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "experience.delete",
    entityType: "experience",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Experience deleted." };
}

export async function saveEducation(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const parsed = educationSchema.safeParse({
    id: formData.get("id") || undefined,
    institution: formData.get("institution"),
    credential: formData.get("credential"),
    field: formData.get("field") || "",
    start_label: formData.get("start_label") || "",
    end_label: formData.get("end_label") || "",
    summary: formData.get("summary") || "",
    sort_order: formData.get("sort_order") || 0,
    published: boolFromForm(formData.get("published")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid education." };
  }

  const payload = {
    institution: sanitizePlainText(parsed.data.institution, 160),
    credential: sanitizePlainText(parsed.data.credential, 160),
    field: sanitizePlainText(parsed.data.field || "", 160) || null,
    start_label: sanitizePlainText(parsed.data.start_label || "", 40) || null,
    end_label: sanitizePlainText(parsed.data.end_label || "", 40) || null,
    summary: sanitizePlainText(parsed.data.summary || "", 1000) || null,
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
    updated_at: new Date().toISOString(),
  };

  const query = parsed.data.id
    ? ctx.supabase.from("education").update(payload).eq("id", parsed.data.id)
    : ctx.supabase.from("education").insert(payload);

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "education.update" : "education.create",
    entityType: "education",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Education saved." };
}

export async function deleteEducation(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid education id." };

  const { error } = await ctx.supabase
    .from("education")
    .delete()
    .eq("id", id.data);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "education.delete",
    entityType: "education",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Education deleted." };
}

export async function saveCertification(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const parsed = certificationSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    issuer: formData.get("issuer"),
    issued_label: formData.get("issued_label") || "",
    credential_id: formData.get("credential_id") || "",
    url: formData.get("url") || "",
    sort_order: formData.get("sort_order") || 0,
    published: boolFromForm(formData.get("published")),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid certification.",
    };
  }

  const payload = {
    name: sanitizePlainText(parsed.data.name, 200),
    issuer: sanitizePlainText(parsed.data.issuer, 160),
    issued_label: sanitizePlainText(parsed.data.issued_label || "", 40) || null,
    credential_id:
      sanitizePlainText(parsed.data.credential_id || "", 120) || null,
    url: sanitizeHref(parsed.data.url) ?? null,
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
    updated_at: new Date().toISOString(),
  };

  const query = parsed.data.id
    ? ctx.supabase
        .from("certifications")
        .update(payload)
        .eq("id", parsed.data.id)
    : ctx.supabase.from("certifications").insert(payload);

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "certification.update" : "certification.create",
    entityType: "certifications",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Certification saved." };
}

export async function deleteCertification(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid certification id." };

  const { error } = await ctx.supabase
    .from("certifications")
    .delete()
    .eq("id", id.data);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "certification.delete",
    entityType: "certifications",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePortfolio();
  return { success: "Certification deleted." };
}

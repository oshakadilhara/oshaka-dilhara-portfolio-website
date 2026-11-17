"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { slugify, splitList } from "@/lib/admin/slug";
import { sanitizeHref, sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { idSchema, projectSchema } from "@/lib/validations/admin";

function boolFromForm(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveProject(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "") || slugify(title);
  const parsed = projectSchema.safeParse({
    id: formData.get("id") || undefined,
    title,
    slug: slugify(slugInput),
    summary: formData.get("summary") || "",
    body_md: formData.get("body_md") || "",
    status: formData.get("status"),
    featured: boolFromForm(formData.get("featured")),
    stack: splitList(formData.get("stack")),
    href: formData.get("href") || "",
    lifecycle: formData.get("lifecycle"),
    cloudcey: boolFromForm(formData.get("cloudcey")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid project." };
  }

  const now = new Date().toISOString();
  let publishedAt: string | null = null;
  if (parsed.data.status === "published") {
    if (parsed.data.id) {
      const { data: existing } = await ctx.supabase
        .from("projects")
        .select("published_at")
        .eq("id", parsed.data.id)
        .maybeSingle();
      publishedAt = existing?.published_at ?? now;
    } else {
      publishedAt = now;
    }
  }

  const payload = {
    slug: parsed.data.slug,
    title: sanitizePlainText(parsed.data.title, 160),
    summary: sanitizePlainText(parsed.data.summary || "", 500) || null,
    body_md: parsed.data.body_md,
    status: parsed.data.status,
    featured: parsed.data.featured,
    stack: parsed.data.stack.map((item) => sanitizePlainText(item, 40)),
    href: sanitizeHref(parsed.data.href) ?? null,
    lifecycle: parsed.data.lifecycle,
    cloudcey: parsed.data.cloudcey,
    updated_by: ctx.user.id,
    updated_at: now,
    published_at: publishedAt,
  };

  const query = parsed.data.id
    ? ctx.supabase.from("projects").update(payload).eq("id", parsed.data.id)
    : ctx.supabase.from("projects").insert({
        ...payload,
        created_by: ctx.user.id,
      });

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "project.update" : "project.create",
    entityType: "projects",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
  revalidatePath("/portfolio");
  return { success: parsed.data.id ? "Project updated." : "Project created." };
}

export async function deleteProject(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid project id." };

  const { error } = await ctx.supabase.from("projects").delete().eq("id", id.data);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "project.delete",
    entityType: "projects",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
  revalidatePath("/portfolio");
  return { success: "Project deleted." };
}

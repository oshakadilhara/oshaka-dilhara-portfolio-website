"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { slugify } from "@/lib/admin/slug";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { contentEntrySchema, idSchema } from "@/lib/validations/admin";
import type { ContentSection } from "@/types/database";

const sectionPaths: Record<ContentSection, string> = {
  resources: "/admin/resources",
  research: "/admin/research",
  architecture: "/admin/architecture",
  learning: "/admin/learning",
};

export async function saveContentEntry(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "") || slugify(title);
  const parsed = contentEntrySchema.safeParse({
    id: formData.get("id") || undefined,
    section: formData.get("section"),
    title,
    slug: slugify(slugInput),
    summary: formData.get("summary") || "",
    body_md: formData.get("body_md") || "",
    status: formData.get("status"),
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid content entry." };
  }

  const now = new Date().toISOString();
  const payload = {
    section: parsed.data.section,
    slug: parsed.data.slug,
    title: sanitizePlainText(parsed.data.title, 200),
    summary: sanitizePlainText(parsed.data.summary || "", 500) || null,
    body_md: parsed.data.body_md,
    status: parsed.data.status,
    sort_order: parsed.data.sort_order,
    updated_by: ctx.user.id,
    updated_at: now,
    published_at: parsed.data.status === "published" ? now : null,
  };

  const query = parsed.data.id
    ? ctx.supabase
        .from("content_entries")
        .update(payload)
        .eq("id", parsed.data.id)
    : ctx.supabase.from("content_entries").insert({
        ...payload,
        created_by: ctx.user.id,
      });

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "content.update" : "content.create",
    entityType: "content_entries",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
    metadata: { section: parsed.data.section },
  });

  revalidatePath(sectionPaths[parsed.data.section]);
  revalidatePath("/admin/dashboard");
  revalidatePath(`/${parsed.data.section}`);
  return {
    success: parsed.data.id ? "Entry updated." : "Entry created.",
  };
}

export async function deleteContentEntry(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  const section = formData.get("section");
  if (!id.success) return { error: "Invalid entry id." };

  const { error } = await ctx.supabase
    .from("content_entries")
    .delete()
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "content.delete",
    entityType: "content_entries",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  if (typeof section === "string" && section in sectionPaths) {
    revalidatePath(sectionPaths[section as ContentSection]);
    revalidatePath(`/${section}`);
  }
  revalidatePath("/admin/dashboard");
  return { success: "Entry deleted." };
}

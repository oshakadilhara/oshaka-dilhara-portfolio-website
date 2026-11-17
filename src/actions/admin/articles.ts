"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { slugify, splitList } from "@/lib/admin/slug";
import { sanitizeHref, sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { articleSchema, idSchema } from "@/lib/validations/admin";

function boolFromForm(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveArticle(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "") || slugify(title);
  const parsed = articleSchema.safeParse({
    id: formData.get("id") || undefined,
    title,
    slug: slugify(slugInput),
    excerpt: formData.get("excerpt") || "",
    body_md: formData.get("body_md") || "",
    status: formData.get("status"),
    category_id: formData.get("category_id") || "",
    tags: splitList(formData.get("tags")),
    featured: boolFromForm(formData.get("featured")),
    cover_url: formData.get("cover_url") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid article." };
  }

  const now = new Date().toISOString();
  let publishedAt: string | null = null;
  if (parsed.data.status === "published") {
    if (parsed.data.id) {
      const { data: existing } = await ctx.supabase
        .from("articles")
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
    title: sanitizePlainText(parsed.data.title, 200),
    excerpt: sanitizePlainText(parsed.data.excerpt || "", 500) || null,
    body_md: parsed.data.body_md,
    status: parsed.data.status,
    category_id: parsed.data.category_id || null,
    tags: parsed.data.tags.map((tag) => sanitizePlainText(tag, 40)),
    featured: parsed.data.featured,
    cover_url: sanitizeHref(parsed.data.cover_url) ?? null,
    updated_by: ctx.user.id,
    updated_at: now,
    published_at: publishedAt,
  };

  const query = parsed.data.id
    ? ctx.supabase.from("articles").update(payload).eq("id", parsed.data.id)
    : ctx.supabase.from("articles").insert({
        ...payload,
        created_by: ctx.user.id,
      });

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "article.update" : "article.create",
    entityType: "articles",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath("/blog");
  return { success: parsed.data.id ? "Article updated." : "Article created." };
}

export async function deleteArticle(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid article id." };

  const { error } = await ctx.supabase.from("articles").delete().eq("id", id.data);
  if (error) return { error: error.message };

  await writeAuditLog({
    action: "article.delete",
    entityType: "articles",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath("/blog");
  return { success: "Article deleted." };
}

"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { slugify } from "@/lib/admin/slug";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { categorySchema, idSchema } from "@/lib/validations/admin";

export async function saveCategory(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "") || slugify(title);
  const parsed = categorySchema.safeParse({
    id: formData.get("id") || undefined,
    title,
    slug: slugify(slugInput),
    description: formData.get("description") || "",
    kind: formData.get("kind"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid category." };
  }

  const payload = {
    slug: parsed.data.slug,
    title: sanitizePlainText(parsed.data.title, 120),
    description: sanitizePlainText(parsed.data.description || "", 500) || null,
    kind: parsed.data.kind,
  };

  const query = parsed.data.id
    ? ctx.supabase.from("categories").update(payload).eq("id", parsed.data.id)
    : ctx.supabase.from("categories").insert(payload);

  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { error: error.message };

  await writeAuditLog({
    action: parsed.data.id ? "category.update" : "category.create",
    entityType: "categories",
    entityId: data?.id ?? parsed.data.id,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/categories");
  return { success: parsed.data.id ? "Category updated." : "Category created." };
}

export async function deleteCategory(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid category id." };

  const { error } = await ctx.supabase
    .from("categories")
    .delete()
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "category.delete",
    entityType: "categories",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/categories");
  return { success: "Category deleted." };
}

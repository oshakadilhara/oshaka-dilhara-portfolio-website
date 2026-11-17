"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { toolMetaSchema } from "@/lib/validations/admin";

function boolFromForm(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveToolMeta(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const parsed = toolMetaSchema.safeParse({
    slug: formData.get("slug"),
    featured: boolFromForm(formData.get("featured")),
    published: boolFromForm(formData.get("published")),
    notes: formData.get("notes") || "",
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid tool metadata." };
  }

  const payload = {
    slug: parsed.data.slug,
    featured: parsed.data.featured,
    published: parsed.data.published,
    notes: sanitizePlainText(parsed.data.notes || "", 1000) || null,
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
    updated_by: ctx.user.id,
  };

  const { error } = await ctx.supabase
    .from("tool_meta")
    .upsert(payload, { onConflict: "slug" });

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "tool_meta.upsert",
    entityType: "tool_meta",
    entityId: parsed.data.slug,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  return { success: "Tool metadata saved." };
}

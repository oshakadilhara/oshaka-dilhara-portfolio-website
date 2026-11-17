"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { splitList } from "@/lib/admin/slug";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { writeAuditLog } from "@/lib/security/audit";
import { siteProfileSchema } from "@/lib/validations/admin";

export async function saveSiteProfile(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const parsed = siteProfileSchema.safeParse({
    name: formData.get("name"),
    headline: formData.get("headline"),
    shortBio: formData.get("shortBio"),
    longBio: formData.get("longBio") || "",
    focusAreas: splitList(formData.get("focusAreas")),
    availabilityNote: formData.get("availabilityNote") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile settings." };
  }

  const value = {
    name: sanitizePlainText(parsed.data.name, 120),
    headline: sanitizePlainText(parsed.data.headline, 200),
    shortBio: sanitizePlainText(parsed.data.shortBio, 500),
    longBio: parsed.data.longBio
      .split(/\n+/)
      .map((line) => sanitizePlainText(line, 1000))
      .filter(Boolean),
    focusAreas: parsed.data.focusAreas.map((item) =>
      sanitizePlainText(item, 80)
    ),
    availabilityNote: sanitizePlainText(parsed.data.availabilityNote, 300),
  };

  const { error } = await ctx.supabase.from("site_settings").upsert(
    {
      key: "profile",
      value,
      updated_at: new Date().toISOString(),
      updated_by: ctx.user.id,
    },
    { onConflict: "key" }
  );

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "settings.profile",
    entityType: "site_settings",
    entityId: "profile",
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: "Site profile saved." };
}

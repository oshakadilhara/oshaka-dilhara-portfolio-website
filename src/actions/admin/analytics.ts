"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/security/audit";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { z } from "zod";

const trackSchema = z.object({
  event_name: z.string().trim().min(1).max(80),
  path: z.string().trim().max(300).optional().or(z.literal("")),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function trackAnalyticsEvent(input: {
  event_name: string;
  path?: string;
  referrer?: string;
}) {
  const ip = await getRequestIp();
  const limited = rateLimit(`analytics:${ip}`, 60, 60 * 1000);
  if (!limited.success) return { ok: false as const };

  const parsed = trackSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };

  try {
    const supabase = await createClient();
    await supabase.from("analytics_events").insert({
      event_name: sanitizePlainText(parsed.data.event_name, 80),
      path: sanitizePlainText(parsed.data.path || "", 300) || null,
      referrer: sanitizePlainText(parsed.data.referrer || "", 500) || null,
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
}

export async function clearAnalyticsEvents(
  _prev: AdminActionState,
  _formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const { error } = await ctx.supabase
    .from("analytics_events")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "analytics.clear",
    entityType: "analytics_events",
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/analytics");
  revalidatePath("/admin/dashboard");
  return { success: "Analytics events cleared." };
}

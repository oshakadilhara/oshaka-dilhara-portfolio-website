"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/security/audit";
import { feedbackStatusSchema, idSchema } from "@/lib/validations/admin";

export async function updateFeedbackStatus(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  const status = feedbackStatusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) {
    return { error: "Invalid feedback update." };
  }

  const { error } = await ctx.supabase
    .from("feedback")
    .update({ status: status.data })
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "feedback.status",
    entityType: "feedback",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
    metadata: { status: status.data },
  });

  revalidatePath("/admin/feedback");
  revalidatePath("/admin/dashboard");
  return { success: "Feedback updated." };
}

export async function deleteFeedback(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid feedback id." };

  const { error } = await ctx.supabase
    .from("feedback")
    .delete()
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "feedback.delete",
    entityType: "feedback",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/feedback");
  revalidatePath("/admin/dashboard");
  return { success: "Feedback deleted." };
}

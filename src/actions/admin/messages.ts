"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionState,
} from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/security/audit";
import { idSchema, messageStatusSchema } from "@/lib/validations/admin";

export async function updateMessageStatus(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  const status = messageStatusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) {
    return { error: "Invalid message update." };
  }

  const { error } = await ctx.supabase
    .from("contact_messages")
    .update({ status: status.data, updated_at: new Date().toISOString() })
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "message.status",
    entityType: "contact_messages",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
    metadata: { status: status.data },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { success: "Message updated." };
}

export async function deleteMessage(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const ctx = await requireAdminContext();
  if (!ctx.ok) return { error: ctx.error };

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid message id." };

  const { error } = await ctx.supabase
    .from("contact_messages")
    .delete()
    .eq("id", id.data);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "message.delete",
    entityType: "contact_messages",
    entityId: id.data,
    actorEmail: ctx.user.email,
    actorUserId: ctx.user.id,
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { success: "Message deleted." };
}

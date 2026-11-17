import { createClient } from "@/lib/supabase/server";

export type AuditEvent = {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  actorEmail?: string | null;
  actorUserId?: string | null;
};

/**
 * Best-effort audit write. Never throws to callers — logging must not break UX.
 * Requires `admin_audit_log` + RLS admin insert policy (see migrations).
 */
export async function writeAuditLog(event: AuditEvent) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("admin_audit_log").insert({
      action: event.action,
      entity_type: event.entityType ?? null,
      entity_id: event.entityId ?? null,
      metadata: event.metadata ?? {},
      actor_email: event.actorEmail ?? null,
      actor_user_id: event.actorUserId ?? null,
    });
    if (error) {
      console.warn("[audit]", error.message);
    }
  } catch (error) {
    console.warn("[audit]", error instanceof Error ? error.message : error);
  }
}

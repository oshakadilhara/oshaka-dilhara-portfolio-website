import { requireAdminUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AdminActionState = {
  error?: string;
  success?: string;
};

export async function requireAdminContext(): Promise<
  | { ok: true; user: User; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; error: string }
> {
  const user = await requireAdminUser();
  if (!user) {
    return { ok: false, error: "Unauthorized. Sign in again." };
  }

  const supabase = await createClient();
  return { ok: true, user, supabase };
}

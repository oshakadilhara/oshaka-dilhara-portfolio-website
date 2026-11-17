"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request";
import { safeAdminNextPath } from "@/lib/security/safe-redirect";
import { writeAuditLog } from "@/lib/security/audit";
import { adminLoginSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  success?: boolean;
};

export async function loginAdmin(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = await getRequestIp();
  const limited = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.success) {
    return {
      error: "Too many login attempts. Please wait and try again.",
    };
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid login details.",
    };
  }

  const { email, password } = parsed.data;

  if (!isAdminEmail(email)) {
    return {
      error: "This account is not authorized for administrator access.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: "Invalid email or password.",
    };
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return {
      error: "This account is not authorized for administrator access.",
    };
  }

  await writeAuditLog({
    action: "admin.login",
    actorEmail: data.user.email,
    actorUserId: data.user.id,
    metadata: { ip },
  });

  redirect(safeAdminNextPath(formData.get("next")));
}

export async function logoutAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await writeAuditLog({
    action: "admin.logout",
    actorEmail: user?.email,
    actorUserId: user?.id,
  });

  await supabase.auth.signOut();
  redirect("/admin/login");
}

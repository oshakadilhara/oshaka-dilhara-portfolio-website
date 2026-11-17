"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { adminLoginSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  success?: boolean;
};

export async function loginAdmin(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
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

  const nextPath = String(formData.get("next") || "/admin/dashboard");
  const safeNext =
    nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/login")
      ? nextPath
      : "/admin/dashboard";

  redirect(safeNext);
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getAdminUser() {
  const user = await getAuthUser();
  if (!user || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) {
    return null;
  }
  return user;
}

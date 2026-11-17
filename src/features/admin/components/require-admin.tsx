import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/session";

/** Server-side gate for every protected admin surface. */
export async function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}

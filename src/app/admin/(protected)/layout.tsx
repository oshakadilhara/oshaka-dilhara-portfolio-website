import { Suspense } from "react";
import { RequireAdmin } from "@/features/admin/components/require-admin";

export const instant = false;

export default function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Checking session...</p>}
    >
      <RequireAdmin>{children}</RequireAdmin>
    </Suspense>
  );
}

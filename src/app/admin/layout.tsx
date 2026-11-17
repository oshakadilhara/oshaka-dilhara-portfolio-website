import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AdminHeader,
  AdminHeaderFallback,
} from "@/features/admin/components/admin-header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Private administrator area.",
  path: "/admin",
  noIndex: true,
});

// Admin routes depend on session cookies — allow blocking for this segment.
export const instant = false;

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<AdminHeaderFallback />}>
        <AdminHeader />
      </Suspense>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}

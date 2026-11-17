import { Suspense } from "react";
import { ContentSectionAdmin } from "@/features/admin/components/content-section-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Architecture",
  description: "Administrator architecture management.",
  path: "/admin/architecture",
  noIndex: true,
});

export const instant = false;

export default async function AdminArchitecturePage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ContentSectionAdmin
        section="architecture"
        showForm={Boolean(params.new)}
      />
    </Suspense>
  );
}

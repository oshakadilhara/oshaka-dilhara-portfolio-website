import { Suspense } from "react";
import { ContentSectionAdmin } from "@/features/admin/components/content-section-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Resources",
  description: "Administrator resources management.",
  path: "/admin/resources",
  noIndex: true,
});

export const instant = false;

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ContentSectionAdmin section="resources" showForm={Boolean(params.new)} />
    </Suspense>
  );
}

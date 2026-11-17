import { Suspense } from "react";
import { ContentSectionAdmin } from "@/features/admin/components/content-section-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Research",
  description: "Administrator research management.",
  path: "/admin/research",
  noIndex: true,
});

export const instant = false;

export default async function AdminResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ContentSectionAdmin section="research" showForm={Boolean(params.new)} />
    </Suspense>
  );
}

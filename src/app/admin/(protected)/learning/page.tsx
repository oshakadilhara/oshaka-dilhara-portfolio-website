import { Suspense } from "react";
import { ContentSectionAdmin } from "@/features/admin/components/content-section-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Learning",
  description: "Administrator learning management.",
  path: "/admin/learning",
  noIndex: true,
});

export const instant = false;

export default async function AdminLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ContentSectionAdmin section="learning" showForm={Boolean(params.new)} />
    </Suspense>
  );
}

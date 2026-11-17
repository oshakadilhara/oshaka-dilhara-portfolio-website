import { Suspense } from "react";
import { DynamicSlugPage } from "@/components/layout/dynamic-slug-page";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ResearchDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Research"
          title="Research"
          description="Loading research entry..."
        />
      }
    >
      <DynamicSlugPage
        params={params}
        eyebrow="Research"
        titlePrefix="Research"
        description="Research entry detail."
      />
    </Suspense>
  );
}

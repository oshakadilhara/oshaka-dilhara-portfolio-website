import { Suspense } from "react";
import { DynamicSlugPage } from "@/components/layout/dynamic-slug-page";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ArchitectureDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Architecture"
          title="Architecture"
          description="Loading architecture reference..."
        />
      }
    >
      <DynamicSlugPage
        params={params}
        eyebrow="Architecture"
        titlePrefix="Architecture"
        description="Architecture reference detail."
      />
    </Suspense>
  );
}

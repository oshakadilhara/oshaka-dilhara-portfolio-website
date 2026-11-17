import { Suspense } from "react";
import { DynamicSlugPage } from "@/components/layout/dynamic-slug-page";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ResourceDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Resources"
          title="Resource"
          description="Loading resource..."
        />
      }
    >
      <DynamicSlugPage
        params={params}
        eyebrow="Resources"
        titlePrefix="Resource"
        description="Downloadable resource detail."
      />
    </Suspense>
  );
}

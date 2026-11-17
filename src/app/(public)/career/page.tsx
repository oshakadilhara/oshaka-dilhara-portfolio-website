import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Developer career hub",
  description: "Interview prep, roadmaps and role-focused practice materials.",
  path: "/career",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Career"
      title="Developer career hub"
      description="Interview prep, roadmaps and role-focused practice materials."
    />
  );
}

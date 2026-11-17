import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Research hub",
  description: "Publications, literature notes, experiments and methodology.",
  path: "/research",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Research"
      title="Research hub"
      description="Publications, literature notes, experiments and methodology."
    />
  );
}

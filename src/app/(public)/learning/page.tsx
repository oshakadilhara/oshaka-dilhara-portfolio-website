import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Learning hub",
  description: "Structured paths across software, AI, data and cloud topics.",
  path: "/learning",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Learning"
      title="Learning hub"
      description="Structured paths across software, AI, data and cloud topics."
    />
  );
}

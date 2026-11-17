import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Learning roadmaps",
  description: "Practical roadmaps for building durable technical skills.",
  path: "/learning/roadmaps",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Learning"
      title="Learning roadmaps"
      description="Practical roadmaps for building durable technical skills."
    />
  );
}

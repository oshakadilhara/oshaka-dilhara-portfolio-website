import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Technology insights",
  description: "Concise perspectives on emerging technology and engineering practice.",
  path: "/insights",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Insights"
      title="Technology insights"
      description="Concise perspectives on emerging technology and engineering practice."
    />
  );
}

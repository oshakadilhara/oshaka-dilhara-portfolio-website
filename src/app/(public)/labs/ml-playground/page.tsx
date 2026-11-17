import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Machine learning playground",
  description: "Interactive ML concepts, metrics and visualizations.",
  path: "/labs/ml-playground",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="Machine learning playground"
      description="Interactive ML concepts, metrics and visualizations."
    />
  );
}

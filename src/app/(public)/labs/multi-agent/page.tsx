import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Multi-agent simulator",
  description: "Simulate collaborative agent workflows and decision paths.",
  path: "/labs/multi-agent",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="Multi-agent simulator"
      description="Simulate collaborative agent workflows and decision paths."
    />
  );
}

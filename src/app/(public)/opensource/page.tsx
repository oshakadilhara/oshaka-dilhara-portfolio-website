import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Open-source showcase",
  description: "Selected open-source projects and contributions.",
  path: "/opensource",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Open source"
      title="Open-source showcase"
      description="Selected open-source projects and contributions."
    />
  );
}

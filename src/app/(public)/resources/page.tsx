import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Downloadable resources",
  description: "Cheat sheets, templates and guides available without login.",
  path: "/resources",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Resources"
      title="Downloadable resources"
      description="Cheat sheets, templates and guides available without login."
    />
  );
}

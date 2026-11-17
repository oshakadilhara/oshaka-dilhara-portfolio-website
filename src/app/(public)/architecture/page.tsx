import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "System architecture library",
  description: "Reference architectures for modern intelligent systems.",
  path: "/architecture",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Architecture"
      title="System architecture library"
      description="Reference architectures for modern intelligent systems."
    />
  );
}

import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Vector search explorer",
  description: "Understand similarity search and embedding neighborhoods.",
  path: "/labs/vector-search",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="Vector search explorer"
      description="Understand similarity search and embedding neighborhoods."
    />
  );
}

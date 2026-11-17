import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "RAG pipeline visualizer",
  description: "Explore retrieval-augmented generation stages visually.",
  path: "/labs/rag-visualizer",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="RAG pipeline visualizer"
      description="Explore retrieval-augmented generation stages visually."
    />
  );
}

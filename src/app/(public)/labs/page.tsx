import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "AI playground",
  description: "Interactive demonstrations for prompts, RAG, vectors, agents and ML.",
  path: "/labs",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="AI playground"
      description="Interactive demonstrations for prompts, RAG, vectors, agents and ML."
    />
  );
}

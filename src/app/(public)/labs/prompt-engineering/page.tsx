import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Prompt engineering lab",
  description: "Practice structured prompting techniques with local demonstrations.",
  path: "/labs/prompt-engineering",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Labs"
      title="Prompt engineering lab"
      description="Practice structured prompting techniques with local demonstrations."
    />
  );
}

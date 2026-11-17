import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: "How this platform handles information and visitor privacy.",
  path: "/privacy",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Legal"
      title="Privacy policy"
      description="How this platform handles information and visitor privacy."
    />
  );
}

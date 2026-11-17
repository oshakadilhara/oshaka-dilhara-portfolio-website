import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms governing use of oshakadilhara.com and related services.",
  path: "/terms",
});

export default function Page() {
  return (
    <SectionPlaceholder
      eyebrow="Legal"
      title="Terms of use"
      description="Terms governing use of oshakadilhara.com and related services."
    />
  );
}

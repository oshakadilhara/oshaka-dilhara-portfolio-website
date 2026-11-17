import { SectionPlaceholder } from "@/components/layout/section-placeholder";

type DynamicSlugPageProps = {
  params: Promise<{ slug: string }>;
  eyebrow: string;
  titlePrefix: string;
  description: string;
};

export async function DynamicSlugPage({
  params,
  eyebrow,
  titlePrefix,
  description,
}: DynamicSlugPageProps) {
  const { slug } = await params;
  return (
    <SectionPlaceholder
      eyebrow={eyebrow}
      title={`${titlePrefix}: ${slug}`}
      description={description}
    />
  );
}

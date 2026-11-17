import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { ToolRenderer } from "@/features/tools/components/tool-renderer";
import { ToolShell } from "@/features/tools/components/tool-shell";
import {
  getImplementedTools,
  getToolBySlug,
} from "@/features/tools/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getImplementedTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return buildMetadata({ title: "Tool not found", path: `/tools/${slug}` });
  }
  return buildMetadata({
    title: tool.title,
    description: tool.description,
    path: `/tools/${slug}`,
  });
}

async function ToolBody({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || !tool.implemented) notFound();

  return (
    <ToolShell tool={tool}>
      <ToolRenderer slug={tool.slug} />
    </ToolShell>
  );
}

export default function ToolPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Tools"
          title="Tool"
          description="Loading tool..."
        />
      }
    >
      <ToolBody params={params} />
    </Suspense>
  );
}

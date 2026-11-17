import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import {
  getToolsByCategory,
  toolCategories,
} from "@/features/tools/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return toolCategories.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = toolCategories.find((item) => item.id === slug);
  return buildMetadata({
    title: category ? category.title : "Tool category",
    description: category?.description ?? "Tools in this category.",
    path: `/tools/category/${slug}`,
  });
}

async function CategoryBody({ params }: PageProps) {
  const { slug } = await params;
  const category = toolCategories.find((item) => item.id === slug);
  if (!category) notFound();
  const tools = getToolsByCategory(slug);

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Tools"
          title={category.title}
          description={category.description}
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/40"
            >
              <h2 className="font-medium tracking-tight">{tool.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
        {tools.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No implemented tools in this category yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function ToolCategoryPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Tools"
          title="Category"
          description="Loading category..."
        />
      }
    >
      <CategoryBody params={params} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { ArticleCard } from "@/features/blog/components/article-card";
import {
  getAllCategories,
  getArticlesByCategory,
} from "@/features/blog/lib/articles";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCategories().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return buildMetadata({
    title: `Category: ${slug}`,
    description: `Articles in the ${slug} category.`,
    path: `/blog/category/${slug}`,
  });
}

async function CategoryBody({ params }: PageProps) {
  const { slug } = await params;
  const articles = getArticlesByCategory(slug);

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Category"
          title={slug}
          description={`${articles.length} published article${articles.length === 1 ? "" : "s"}.`}
        />
        <div className="mt-12 grid gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogCategoryPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Blog"
          title="Category"
          description="Loading category..."
        />
      }
    >
      <CategoryBody params={params} />
    </Suspense>
  );
}

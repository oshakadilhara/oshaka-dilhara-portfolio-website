import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarkdownContent } from "@/features/blog/components/markdown-content";
import { ArticleCard } from "@/features/blog/components/article-card";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/features/blog/lib/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({ title: "Article not found", path: `/blog/${slug}` });
  }
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${slug}`,
  });
}

async function ArticleBody({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(slug);

  return (
    <article className="surface-grid">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          <Link href={`/blog/category/${article.category}`}>
            {article.category}
          </Link>
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          <span aria-hidden>·</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>
        <div className="mt-10 border-t border-border/60 pt-10">
          <MarkdownContent content={article.content} />
        </div>
        {related.length > 0 ? (
          <section className="mt-16 border-t border-border/60 pt-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Related articles
            </h2>
            <div className="mt-6 grid gap-4">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

export default function BlogArticlePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <SectionPlaceholder
          eyebrow="Blog"
          title="Article"
          description="Loading article..."
        />
      }
    >
      <ArticleBody params={params} />
    </Suspense>
  );
}

import { PageHeader } from "@/components/layout/page-header";
import { ArticleCard } from "@/features/blog/components/article-card";
import {
  getAllCategories,
  getAllTags,
  getPublishedArticles,
} from "@/features/blog/lib/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Articles on AI, engineering, data systems and career development.",
  path: "/blog",
});

export default function BlogPage() {
  const articles = getPublishedArticles();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Blog"
          title="Technology publication"
          description="Practical writing on artificial intelligence, software engineering and building useful digital systems."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog/category/${category}`}
              className="rounded-md border border-border/70 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Tags
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-md border border-border/70 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

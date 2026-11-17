import Link from "next/link";
import type { ArticleMeta } from "@/types/blog";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/40 hover:bg-card">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Link
          href={`/blog/category/${article.category}`}
          className="font-medium text-primary hover:underline"
        >
          {article.category}
        </Link>
        <span aria-hidden>·</span>
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        <span aria-hidden>·</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>
      <h2 className="mt-3 text-xl font-medium tracking-tight">
        <Link href={`/blog/${article.slug}`} className="hover:text-primary">
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {article.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

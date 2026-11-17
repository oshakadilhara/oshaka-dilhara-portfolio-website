import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/types/blog";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="panel-hover glass-panel group relative overflow-hidden rounded-3xl p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Link
          href={`/blog/category/${article.category}`}
          className="font-medium tracking-wide text-primary hover:underline"
        >
          {article.category}
        </Link>
        <span aria-hidden>·</span>
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        <span aria-hidden>·</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h2>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {article.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="rounded-lg border border-border/60 bg-background/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

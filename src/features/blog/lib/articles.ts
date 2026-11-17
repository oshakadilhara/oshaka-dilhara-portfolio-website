import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Article, ArticleMeta, ArticleStatus } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function isStatus(value: unknown): value is ArticleStatus {
  return value === "draft" || value === "published" || value === "archived";
}

function parseArticle(slug: string, raw: string): Article {
  const { data, content } = matter(raw);
  const status = isStatus(data.status) ? data.status : "draft";
  const tags = Array.isArray(data.tags)
    ? data.tags.map(String)
    : [];

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    category: String(data.category ?? "uncategorized"),
    tags,
    status,
    featured: Boolean(data.featured),
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

function readAllArticles(): Article[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      return parseArticle(slug, raw);
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedArticles(): ArticleMeta[] {
  return readAllArticles()
    .filter((article) => article.status === "published")
    .map((article) => {
      const { content, ...meta } = article;
      void content;
      return meta;
    });
}

export function getFeaturedArticles(limit = 3): ArticleMeta[] {
  return getPublishedArticles()
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | null {
  const article = readAllArticles().find((item) => item.slug === slug);
  if (!article || article.status !== "published") {
    return null;
  }
  return article;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getPublishedArticles().filter(
    (article) => article.category === category
  );
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getPublishedArticles().filter((article) =>
    article.tags.includes(tag)
  );
}

export function getAllCategories(): string[] {
  return [...new Set(getPublishedArticles().map((article) => article.category))];
}

export function getAllTags(): string[] {
  return [
    ...new Set(getPublishedArticles().flatMap((article) => article.tags)),
  ].sort();
}

export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  return getPublishedArticles()
    .filter((article) => article.slug !== slug)
    .map((article) => {
      const sharedTags = article.tags.filter((tag) =>
        current.tags.includes(tag)
      ).length;
      const sameCategory = article.category === current.category ? 1 : 0;
      return { article, score: sharedTags * 2 + sameCategory };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

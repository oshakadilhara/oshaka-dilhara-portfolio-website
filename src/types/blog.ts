export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured?: boolean;
};

export type ArticleMeta = ArticleFrontmatter & {
  slug: string;
  readingTimeMinutes: number;
};

export type Article = ArticleMeta & {
  content: string;
};

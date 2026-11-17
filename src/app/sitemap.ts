import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/features/blog/lib/articles";
import { getImplementedTools } from "@/features/tools/data/catalog";
import { absoluteUrl } from "@/lib/seo/metadata";

const staticRoutes = [
  "/",
  "/about",
  "/portfolio",
  "/portfolio/experience",
  "/portfolio/projects",
  "/portfolio/case-studies",
  "/portfolio/certifications",
  "/portfolio/education",
  "/blog",
  "/tools",
  "/labs",
  "/labs/prompt-engineering",
  "/labs/rag-visualizer",
  "/labs/vector-search",
  "/labs/multi-agent",
  "/labs/ml-playground",
  "/learning",
  "/learning/roadmaps",
  "/architecture",
  "/research",
  "/resources",
  "/opensource",
  "/career",
  "/insights",
  "/cloudcey",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : 0.7,
  }));

  const articleEntries = getPublishedArticles().map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const toolEntries = getImplementedTools().map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...articleEntries, ...toolEntries];
}

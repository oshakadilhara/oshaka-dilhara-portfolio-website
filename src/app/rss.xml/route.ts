import { getPublishedArticles } from "@/features/blog/lib/articles";
import { absoluteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export function GET() {
  const articles = getPublishedArticles();
  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${absoluteUrl(`/blog/${article.slug}`)}</link>
      <guid>${absoluteUrl(`/blog/${article.slug}`)}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${siteConfig.description}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

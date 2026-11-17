import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Articles",
  description: "Administrator articles management.",
  path: "/admin/articles",
  noIndex: true,
});

export default function AdminArticlesPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Articles</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin articles management will be implemented in Phase 9.
      </p>
    </div>
  );
}

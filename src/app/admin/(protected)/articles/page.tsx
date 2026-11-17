import Link from "next/link";
import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { ArticleForm } from "@/features/admin/components/article-form";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { DeleteForm } from "@/features/admin/components/inbox-row-actions";
import { deleteArticle } from "@/actions/admin/articles";
import { getArticle, listArticles, listCategories } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata = buildMetadata({
  title: "Admin Articles",
  description: "Administrator articles management.",
  path: "/admin/articles",
  noIndex: true,
});

export const instant = false;

async function ArticlesContent({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const [{ rows, error }, { rows: categories }] = await Promise.all([
    listArticles(),
    listCategories(),
  ]);
  const blogCategories = categories.filter((category) => category.kind === "blog");

  const editing =
    params.edit ? (await getArticle(params.edit)).row : null;

  return (
    <div>
      <PageHeading
        title="Articles"
        description="Draft and publish blog posts stored in Supabase."
        actionHref="/admin/articles?new=1"
        actionLabel="New article"
      />
      <AdminNotice
        error={error}
        empty={!error && rows.length === 0 && !params.new ? "No articles yet." : undefined}
      />

      {params.new || editing ? (
        <div className="mb-10 max-w-3xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">
              {editing ? "Edit article" : "New article"}
            </h2>
            <Link
              href="/admin/articles"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Cancel
            </Link>
          </div>
          <ArticleForm article={editing} categories={blogCategories} />
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border/70 text-muted-foreground">
            <tr>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Updated</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 align-top">
                <td className="py-3 pr-3">
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">/{row.slug}</p>
                </td>
                <td className="py-3 pr-3">
                  <StatusBadge value={row.status} />
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {new Date(row.updated_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/articles?edit=${row.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "xs" })
                      )}
                    >
                      Edit
                    </Link>
                    <DeleteForm id={row.id} action={deleteArticle} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ArticlesContent searchParams={searchParams} />
    </Suspense>
  );
}

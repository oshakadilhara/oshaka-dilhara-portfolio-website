import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { CategoryForm } from "@/features/admin/components/category-form";
import { DeleteForm } from "@/features/admin/components/inbox-row-actions";
import { deleteCategory } from "@/actions/admin/categories";
import { listCategories } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Categories",
  description: "Administrator categories management.",
  path: "/admin/categories",
  noIndex: true,
});

export const instant = false;

async function CategoriesContent() {
  const { rows, error } = await listCategories();

  return (
    <div>
      <PageHeading
        title="Categories"
        description="Taxonomies for articles, tools, resources, and projects."
      />
      <AdminNotice error={error} />

      <div className="mb-10 max-w-2xl">
        <h2 className="mb-4 text-lg font-medium">Create category</h2>
        <CategoryForm />
      </div>

      <div className="space-y-8">
        {rows.map((row) => (
          <div key={row.id} className="space-y-4 border-t border-border/60 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium tracking-tight">{row.title}</p>
                <p className="text-xs text-muted-foreground">
                  {row.kind} · /{row.slug}
                </p>
              </div>
              <DeleteForm id={row.id} action={deleteCategory} />
            </div>
            <CategoryForm category={row} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <CategoriesContent />
    </Suspense>
  );
}

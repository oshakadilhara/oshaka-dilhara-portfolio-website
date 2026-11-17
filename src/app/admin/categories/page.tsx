import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Categories",
  description: "Administrator categories management.",
  path: "/admin/categories",
  noIndex: true,
});

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin categories management will be implemented in Phase 9.
      </p>
    </div>
  );
}

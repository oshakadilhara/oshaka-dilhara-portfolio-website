import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Resources",
  description: "Administrator resources management.",
  path: "/admin/resources",
  noIndex: true,
});

export default function AdminResourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin resources management will be implemented in Phase 9.
      </p>
    </div>
  );
}

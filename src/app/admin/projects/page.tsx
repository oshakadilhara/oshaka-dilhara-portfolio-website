import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Projects",
  description: "Administrator projects management.",
  path: "/admin/projects",
  noIndex: true,
});

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin projects management will be implemented in Phase 9.
      </p>
    </div>
  );
}

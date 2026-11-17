import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Tools",
  description: "Administrator tools management.",
  path: "/admin/tools",
  noIndex: true,
});

export default function AdminToolsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin tools management will be implemented in Phase 9.
      </p>
    </div>
  );
}

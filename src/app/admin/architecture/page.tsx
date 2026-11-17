import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Architecture",
  description: "Administrator architecture management.",
  path: "/admin/architecture",
  noIndex: true,
});

export default function AdminArchitecturePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Architecture</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin architecture management will be implemented in Phase 9.
      </p>
    </div>
  );
}

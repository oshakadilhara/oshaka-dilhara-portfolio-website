import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Research",
  description: "Administrator research management.",
  path: "/admin/research",
  noIndex: true,
});

export default function AdminResearchPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Research</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin research management will be implemented in Phase 9.
      </p>
    </div>
  );
}

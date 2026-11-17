import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Learning",
  description: "Administrator learning management.",
  path: "/admin/learning",
  noIndex: true,
});

export default function AdminLearningPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Learning</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin learning management will be implemented in Phase 9.
      </p>
    </div>
  );
}

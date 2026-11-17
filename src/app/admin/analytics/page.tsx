import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Analytics",
  description: "Administrator analytics management.",
  path: "/admin/analytics",
  noIndex: true,
});

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin analytics management will be implemented in Phase 9.
      </p>
    </div>
  );
}

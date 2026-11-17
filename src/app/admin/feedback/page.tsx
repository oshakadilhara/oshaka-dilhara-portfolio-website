import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Feedback",
  description: "Administrator feedback management.",
  path: "/admin/feedback",
  noIndex: true,
});

export default function AdminFeedbackPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Feedback</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin feedback management will be implemented in Phase 9.
      </p>
    </div>
  );
}

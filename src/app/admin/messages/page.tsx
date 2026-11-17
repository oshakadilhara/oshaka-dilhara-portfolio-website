import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Messages",
  description: "Administrator messages management.",
  path: "/admin/messages",
  noIndex: true,
});

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin messages management will be implemented in Phase 9.
      </p>
    </div>
  );
}

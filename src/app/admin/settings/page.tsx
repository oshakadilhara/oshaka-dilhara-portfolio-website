import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Settings",
  description: "Administrator settings management.",
  path: "/admin/settings",
  noIndex: true,
});

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Admin settings management will be implemented in Phase 9.
      </p>
    </div>
  );
}

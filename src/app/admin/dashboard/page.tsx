import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin dashboard",
  description: "Administrator overview.",
  path: "/admin/dashboard",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const admin = await requireAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Signed in as <span className="text-foreground">{admin.email}</span>.
        Content management CRUD arrives in Phase 9. Authentication and route
        protection are active now.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Articles",
          "Projects",
          "Tools",
          "Messages",
          "Analytics",
          "Settings",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-border/70 bg-card/40 p-5"
          >
            <p className="font-medium tracking-tight">{item}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Management UI coming next.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

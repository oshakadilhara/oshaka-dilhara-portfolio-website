import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { AdminNotice } from "@/features/admin/components/field";

export const metadata = buildMetadata({
  title: "Admin dashboard",
  description: "Administrator overview.",
  path: "/admin/dashboard",
  noIndex: true,
});

export const instant = false;

async function DashboardContent() {
  const admin = await requireAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  const cards = [
    { label: "New messages", value: stats.newMessages, href: "/admin/messages" },
    { label: "New feedback", value: stats.newFeedback, href: "/admin/feedback" },
    {
      label: "Published articles",
      value: stats.publishedArticles,
      href: "/admin/articles",
    },
    {
      label: "Published projects",
      value: stats.publishedProjects,
      href: "/admin/projects",
    },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    {
      label: "Published hub entries",
      value: stats.publishedContent,
      href: "/admin/resources",
    },
    {
      label: "Analytics events",
      value: stats.analyticsEvents,
      href: "/admin/analytics",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Signed in as <span className="text-foreground">{admin.email}</span>.
        Manage content, inbox, and site settings from the admin navigation.
      </p>

      {stats.errors.length ? (
        <div className="mt-6">
          <AdminNotice error={stats.errors[0]} />
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href + card.label}
            href={card.href}
            className="rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card/70"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import { clearAnalyticsEvents } from "@/actions/admin/analytics";
import {
  getAnalyticsSummary,
  listAnalyticsEvents,
} from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Analytics",
  description: "Administrator analytics overview.",
  path: "/admin/analytics",
  noIndex: true,
});

export const instant = false;

async function AnalyticsContent() {
  const [summary, recent] = await Promise.all([
    getAnalyticsSummary(),
    listAnalyticsEvents(50),
  ]);

  return (
    <div>
      <PageHeading
        title="Analytics"
        description="Lightweight first-party events from the last 7 days."
      />
      <AdminNotice error={summary.error || recent.error} />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Events this week</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {summary.weekTotal}
          </p>
        </div>
        <AdminActionForm
          action={clearAnalyticsEvents}
          confirmMessage="Clear all analytics events?"
        >
          <SubmitButton variant="destructive" size="sm">
            Clear events
          </SubmitButton>
        </AdminActionForm>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-medium">By event</h2>
          <ul className="space-y-2 text-sm">
            {summary.byName.length === 0 ? (
              <li className="text-muted-foreground">No events yet.</li>
            ) : (
              summary.byName.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 border-b border-border/50 py-2"
                >
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-medium">Top paths</h2>
          <ul className="space-y-2 text-sm">
            {summary.byPath.length === 0 ? (
              <li className="text-muted-foreground">No path data yet.</li>
            ) : (
              summary.byPath.map((item) => (
                <li
                  key={item.path}
                  className="flex items-center justify-between gap-3 border-b border-border/50 py-2"
                >
                  <span className="truncate">{item.path}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-medium">Recent events</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="py-2 pr-3 font-medium">When</th>
                <th className="py-2 pr-3 font-medium">Event</th>
                <th className="py-2 font-medium">Path</th>
              </tr>
            </thead>
            <tbody>
              {recent.rows.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="py-2 pr-3 text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3">{row.event_name}</td>
                  <td className="py-2">{row.path || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <AnalyticsContent />
    </Suspense>
  );
}

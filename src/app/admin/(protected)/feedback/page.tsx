import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { StatusBadge } from "@/features/admin/components/status-badge";
import {
  DeleteForm,
  InboxStatusForm,
} from "@/features/admin/components/inbox-row-actions";
import { deleteFeedback, updateFeedbackStatus } from "@/actions/admin/feedback";
import { listFeedback } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Feedback",
  description: "Administrator feedback management.",
  path: "/admin/feedback",
  noIndex: true,
});

export const instant = false;

async function FeedbackContent() {
  const { rows, error } = await listFeedback();

  return (
    <div>
      <PageHeading
        title="Feedback"
        description="Visitor feedback submissions for review."
      />
      <AdminNotice
        error={error}
        empty={!error && rows.length === 0 ? "No feedback yet." : undefined}
      />
      <div className="space-y-6">
        {rows.map((row) => (
          <article
            key={row.id}
            className="border-t border-border/60 pt-5 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {row.page_path || "Unknown page"} ·{" "}
                  {new Date(row.created_at).toLocaleString()}
                  {row.rating ? ` · ${row.rating}/5` : ""}
                </p>
              </div>
              <StatusBadge value={row.status} />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {row.message}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <InboxStatusForm
                id={row.id}
                action={updateFeedbackStatus}
                current={row.status}
                options={[
                  { value: "new", label: "New" },
                  { value: "reviewed", label: "Reviewed" },
                  { value: "archived", label: "Archived" },
                ]}
              />
              <DeleteForm id={row.id} action={deleteFeedback} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AdminFeedbackPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <FeedbackContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { StatusBadge } from "@/features/admin/components/status-badge";
import {
  DeleteForm,
  InboxStatusForm,
} from "@/features/admin/components/inbox-row-actions";
import { deleteMessage, updateMessageStatus } from "@/actions/admin/messages";
import { listMessages } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Messages",
  description: "Administrator messages management.",
  path: "/admin/messages",
  noIndex: true,
});

export const instant = false;

async function MessagesContent() {
  const { rows, error } = await listMessages();

  return (
    <div>
      <PageHeading
        title="Messages"
        description="Contact form inbox. Update status or delete spam."
      />
      <AdminNotice
        error={error}
        empty={!error && rows.length === 0 ? "No messages yet." : undefined}
      />
      <div className="space-y-6">
        {rows.map((row) => (
          <article
            key={row.id}
            className="border-t border-border/60 pt-5 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium tracking-tight">
                  {row.subject || "No subject"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.name} · {row.email} ·{" "}
                  {new Date(row.created_at).toLocaleString()}
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
                action={updateMessageStatus}
                current={row.status}
                options={[
                  { value: "new", label: "New" },
                  { value: "read", label: "Read" },
                  { value: "archived", label: "Archived" },
                  { value: "spam", label: "Spam" },
                ]}
              />
              <DeleteForm id={row.id} action={deleteMessage} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <MessagesContent />
    </Suspense>
  );
}

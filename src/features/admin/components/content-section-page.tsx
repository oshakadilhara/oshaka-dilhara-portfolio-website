import Link from "next/link";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { ContentForm } from "@/features/admin/components/content-form";
import { DeleteForm } from "@/features/admin/components/inbox-row-actions";
import { deleteContentEntry } from "@/actions/admin/content";
import { listContentEntries } from "@/lib/admin/queries";
import type { ContentSection } from "@/types/database";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const copy: Record<
  ContentSection,
  { title: string; description: string; createHref: string }
> = {
  resources: {
    title: "Resources",
    description: "Curated links, kits, and reference material.",
    createHref: "/admin/resources?new=1",
  },
  research: {
    title: "Research",
    description: "Notes and write-ups from ongoing research.",
    createHref: "/admin/research?new=1",
  },
  architecture: {
    title: "Architecture",
    description: "System design notes and architecture patterns.",
    createHref: "/admin/architecture?new=1",
  },
  learning: {
    title: "Learning",
    description: "Learning paths, roadmaps, and study guides.",
    createHref: "/admin/learning?new=1",
  },
};

export async function ContentSectionAdmin({
  section,
  showForm,
}: {
  section: ContentSection;
  showForm?: boolean;
}) {
  const { rows, error } = await listContentEntries(section);
  const meta = copy[section];

  return (
    <div>
      <PageHeading
        title={meta.title}
        description={meta.description}
        actionHref={meta.createHref}
        actionLabel="New entry"
      />
      <AdminNotice error={error} empty={!error && rows.length === 0 ? "No entries yet." : undefined} />

      {showForm ? (
        <div className="mb-10 max-w-3xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">New entry</h2>
            <Link
              href={`/admin/${section}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Cancel
            </Link>
          </div>
          <ContentForm section={section} />
        </div>
      ) : null}

      <div className="space-y-8">
        {rows.map((row) => (
          <div
            key={row.id}
            className="space-y-4 border-t border-border/60 pt-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium tracking-tight">{row.title}</p>
                <p className="text-xs text-muted-foreground">/{row.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge value={row.status} />
                <DeleteForm
                  id={row.id}
                  action={deleteContentEntry}
                  hiddenFields={{ section }}
                />
              </div>
            </div>
            <ContentForm section={section} entry={row} />
          </div>
        ))}
      </div>
    </div>
  );
}

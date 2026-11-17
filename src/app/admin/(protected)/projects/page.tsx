import Link from "next/link";
import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { ProjectForm } from "@/features/admin/components/project-form";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { DeleteForm } from "@/features/admin/components/inbox-row-actions";
import { deleteProject } from "@/actions/admin/projects";
import { getProject, listProjects } from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata = buildMetadata({
  title: "Admin Projects",
  description: "Administrator projects management.",
  path: "/admin/projects",
  noIndex: true,
});

export const instant = false;

async function ProjectsContent({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const { rows, error } = await listProjects();
  const editing = params.edit ? (await getProject(params.edit)).row : null;

  return (
    <div>
      <PageHeading
        title="Projects"
        description="Portfolio projects managed in Supabase."
        actionHref="/admin/projects?new=1"
        actionLabel="New project"
      />
      <AdminNotice
        error={error}
        empty={!error && rows.length === 0 && !params.new ? "No projects yet." : undefined}
      />

      {params.new || editing ? (
        <div className="mb-10 max-w-3xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">
              {editing ? "Edit project" : "New project"}
            </h2>
            <Link
              href="/admin/projects"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Cancel
            </Link>
          </div>
          <ProjectForm project={editing} />
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border/70 text-muted-foreground">
            <tr>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Updated</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 align-top">
                <td className="py-3 pr-3">
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">/{row.slug}</p>
                </td>
                <td className="py-3 pr-3">
                  <StatusBadge value={row.status} />
                </td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {new Date(row.updated_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects?edit=${row.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "xs" })
                      )}
                    >
                      Edit
                    </Link>
                    <DeleteForm id={row.id} action={deleteProject} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ProjectsContent searchParams={searchParams} />
    </Suspense>
  );
}

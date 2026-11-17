import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import { ToolMetaForm } from "@/features/admin/components/tool-meta-form";
import { listToolMeta } from "@/lib/admin/queries";
import { tools } from "@/features/tools/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Tools",
  description: "Administrator tools management.",
  path: "/admin/tools",
  noIndex: true,
});

export const instant = false;

async function ToolsContent() {
  const { rows, error } = await listToolMeta();
  const metaBySlug = new Map(rows.map((row) => [row.slug, row]));

  return (
    <div>
      <PageHeading
        title="Tools"
        description="Tool UIs live in code. Use metadata overlays for featured ordering, notes, and visibility."
      />
      <AdminNotice error={error} />

      <div className="space-y-8">
        {tools.map((tool) => {
          const meta = metaBySlug.get(tool.slug) ?? null;
          return (
            <div
              key={tool.slug}
              className="grid gap-4 border-t border-border/60 pt-6 lg:grid-cols-[1fr_320px]"
            >
              <div>
                <p className="font-medium tracking-tight">{tool.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  /tools/{tool.slug} · {tool.category}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
              <ToolMetaForm slug={tool.slug} meta={meta} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminToolsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <ToolsContent />
    </Suspense>
  );
}

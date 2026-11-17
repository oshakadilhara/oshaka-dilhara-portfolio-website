import { PageHeader } from "@/components/layout/page-header";
import { ToolsDirectory } from "@/features/tools/components/tools-directory";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Free tools",
  description:
    "Browser-based utilities for developers, analysts and students. No registration required.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Tools"
          title="Free online tools"
          description="Every public tool works in the browser without login. Processing stays local wherever practical."
        />
        <ToolsDirectory />
      </div>
    </div>
  );
}

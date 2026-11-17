import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SectionPlaceholderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  nextHref?: string;
  nextLabel?: string;
};

export function SectionPlaceholder({
  eyebrow,
  title,
  description,
  nextHref = "/",
  nextLabel = "Back to home",
}: SectionPlaceholderProps) {
  return (
    <div className="relative overflow-hidden surface-grid">
      <div className="surface-mesh pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-28 sm:px-6">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <p className="glass-panel mt-8 rounded-full px-4 py-1.5 text-xs text-muted-foreground">
          Content for this section will be expanded in upcoming phases.
        </p>
        <Link
          href={nextHref}
          className={cn(buttonVariants({ variant: "outline" }), "mt-10")}
        >
          {nextLabel}
        </Link>
      </div>
    </div>
  );
}

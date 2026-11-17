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
    <div className="surface-grid">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 sm:px-6">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <p className="mt-8 rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground">
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

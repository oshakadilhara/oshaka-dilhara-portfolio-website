import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}

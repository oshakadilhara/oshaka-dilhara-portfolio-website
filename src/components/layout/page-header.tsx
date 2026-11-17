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
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h1 className="display-title text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]">
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
      <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </header>
  );
}

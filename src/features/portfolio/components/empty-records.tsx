export function EmptyRecords({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/30 px-6 py-10 text-center">
      <h3 className="text-base font-medium tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

import { PageHeader } from "@/components/layout/page-header";
import { EmptyRecords } from "@/features/portfolio/components/empty-records";
import { getExperiences } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Experience",
  description: "Professional work experience.",
  path: "/portfolio/experience",
});

export default function ExperiencePage() {
  const experiences = getExperiences();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Experience"
          title="Work experience"
          description="Roles are published only after verification through the administrator dashboard."
        />
        <div className="mt-14">
          {experiences.length === 0 ? (
            <EmptyRecords
              title="No experience entries published yet"
              description="This section intentionally contains no fabricated employment history. Verified roles will appear here once added in admin."
            />
          ) : (
            <ul className="space-y-4">
              {experiences.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-card/40 p-6"
                >
                  <p className="text-sm text-primary">
                    {item.startLabel} — {item.endLabel}
                  </p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight">
                    {item.role}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{item.company}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/layout/page-header";
import { getCaseStudies } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Case studies",
  description:
    "Deeper narratives on problem framing, architecture and delivery.",
  path: "/portfolio/case-studies",
});

export default function CaseStudiesPage() {
  const studies = getCaseStudies();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Case studies"
          title="Case studies"
          description="Exploratory narratives that document approach and trade-offs without overstating unvalidated outcomes."
        />
        <div className="mt-14 space-y-6">
          {studies.map((study) => (
            <article
              key={study.id}
              className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-medium tracking-tight">
                {study.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{study.summary}</p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
                    Problem
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {study.problem}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
                    Approach
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {study.approach}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
                    Outcome
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {study.outcome}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

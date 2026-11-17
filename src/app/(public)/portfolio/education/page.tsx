import { PageHeader } from "@/components/layout/page-header";
import { EmptyRecords } from "@/features/portfolio/components/empty-records";
import { getEducation } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Education",
  description: "Academic background and continued learning.",
  path: "/portfolio/education",
});

export default function EducationPage() {
  const education = getEducation();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Education"
          title="Education"
          description="Academic credentials will be listed here once verified and published."
        />
        <div className="mt-14">
          {education.length === 0 ? (
            <EmptyRecords
              title="No education entries published yet"
              description="Education records remain empty until verified details are added through the admin dashboard."
            />
          ) : (
            <ul className="space-y-4">
              {education.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-card/40 p-6"
                >
                  <h2 className="text-xl font-medium tracking-tight">
                    {item.credential}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{item.institution}</p>
                  {item.summary ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

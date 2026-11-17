import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyRecords } from "@/features/portfolio/components/empty-records";
import { getCertifications } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Certifications",
  description: "Verified professional certifications and credentials.",
  path: "/portfolio/certifications",
});

async function CertificationsContent() {
  const certifications = await getCertifications();

  if (certifications.length === 0) {
    return (
      <EmptyRecords
        title="No certifications published yet"
        description="Certification entries stay empty until verified credentials are added in the administrator dashboard."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {certifications.map((item) => (
        <li
          key={item.id}
          className="rounded-2xl border border-border/70 bg-card/40 p-6"
        >
          <h2 className="text-xl font-medium tracking-tight">{item.name}</h2>
          <p className="mt-1 text-muted-foreground">{item.issuer}</p>
        </li>
      ))}
    </ul>
  );
}

export default function CertificationsPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Certifications"
          title="Certifications"
          description="Only verified certifications will be published here."
        />
        <div className="mt-14">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">Loading...</p>
            }
          >
            <CertificationsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

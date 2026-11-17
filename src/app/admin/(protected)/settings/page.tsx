import { Suspense } from "react";
import { PageHeading } from "@/features/admin/components/page-heading";
import { AdminNotice } from "@/features/admin/components/field";
import {
  CertificationList,
  EducationList,
  ExperienceList,
  SiteProfileForm,
} from "@/features/admin/components/settings-forms";
import {
  getSiteSetting,
  listCertifications,
  listEducation,
  listExperience,
} from "@/lib/admin/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin Settings",
  description: "Administrator settings management.",
  path: "/admin/settings",
  noIndex: true,
});

export const instant = false;

async function SettingsContent() {
  const [profile, experience, education, certifications] = await Promise.all([
    getSiteSetting("profile"),
    listExperience(),
    listEducation(),
    listCertifications(),
  ]);

  const firstError =
    profile.error ||
    experience.error ||
    education.error ||
    certifications.error;

  return (
    <div>
      <PageHeading
        title="Settings"
        description="Site profile and verified portfolio history."
      />
      <AdminNotice error={firstError} />

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 text-lg font-medium">Site profile</h2>
        <SiteProfileForm
          value={
            (profile.row?.value as {
              name?: string;
              headline?: string;
              shortBio?: string;
              longBio?: string[];
              focusAreas?: string[];
              availabilityNote?: string;
            }) ?? null
          }
        />
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 text-lg font-medium">Experience</h2>
        <ExperienceList rows={experience.rows} />
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 text-lg font-medium">Education</h2>
        <EducationList rows={education.rows} />
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 text-lg font-medium">Certifications</h2>
        <CertificationList rows={certifications.rows} />
      </section>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <SettingsContent />
    </Suspense>
  );
}

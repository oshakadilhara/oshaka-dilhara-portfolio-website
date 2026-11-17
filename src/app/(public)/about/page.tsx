import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SkillsGrid } from "@/features/portfolio/components/skills-grid";
import { getProfile, getSkills } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Background, philosophy and the mission behind the Oshaka Dilhara technology platform.",
  path: "/about",
});

async function AboutContent() {
  const profile = await getProfile();
  const skills = getSkills();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={profile.name}
        description={profile.headline}
      />

      <div className="mx-auto mt-14 max-w-3xl space-y-5 text-muted-foreground">
        {profile.longBio.map((paragraph) => (
          <p
            key={paragraph}
            className="text-pretty text-base leading-relaxed sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-6">
          <SkillsGrid skills={skills} />
        </div>
      </div>

      <div className="mt-12">
        <Link href="/contact" className={cn(buttonVariants())}>
          Get in touch
        </Link>
      </div>
    </>
  );
}

export default function AboutPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          }
        >
          <AboutContent />
        </Suspense>
      </div>
    </div>
  );
}

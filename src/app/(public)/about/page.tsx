import Link from "next/link";
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

export default function AboutPage() {
  const profile = getProfile();
  const skills = getSkills();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="About"
          title={profile.name}
          description={profile.headline}
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-5 text-muted-foreground">
          {profile.longBio.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-base leading-relaxed sm:text-lg">
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

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/portfolio" className={cn(buttonVariants())}>
            View portfolio
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

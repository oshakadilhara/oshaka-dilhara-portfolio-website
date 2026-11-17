import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import { getFeaturedProjects } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Experience, projects, case studies, certifications and education.",
  path: "/portfolio",
});

const links = [
  {
    title: "Projects",
    href: "/portfolio/projects",
    description: "Selected engineering and product work.",
  },
  {
    title: "Experience",
    href: "/portfolio/experience",
    description: "Verified professional roles managed via admin.",
  },
  {
    title: "Case studies",
    href: "/portfolio/case-studies",
    description: "Deeper narratives on approach and trade-offs.",
  },
  {
    title: "Certifications",
    href: "/portfolio/certifications",
    description: "Credentials added only when verified.",
  },
  {
    title: "Education",
    href: "/portfolio/education",
    description: "Academic background managed via admin.",
  },
] as const;

async function FeaturedProjects() {
  const featured = await getFeaturedProjects();
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {featured.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Portfolio"
          title="Professional portfolio"
          description="A structured view of projects and professional information. Employment history and credentials remain empty until verified content is published."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-medium tracking-tight">
                  {link.title}
                </h2>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured projects
          </h2>
          <Suspense
            fallback={
              <p className="mt-6 text-sm text-muted-foreground">
                Loading projects...
              </p>
            }
          >
            <FeaturedProjects />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

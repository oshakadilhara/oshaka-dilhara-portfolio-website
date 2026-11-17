import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import { getAllProjects } from "@/features/portfolio/lib/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected projects across AI systems, data platforms and software products.",
  path: "/portfolio/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Projects"
          title="Selected projects"
          description="Honest project summaries without fabricated results. Status labels distinguish concepts, active work and maintained initiatives."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-10 space-y-8">
          {projects.map((project) => (
            <article
              key={`${project.id}-detail`}
              className="rounded-2xl border border-border/70 bg-card/30 p-6"
            >
              <h2 className="text-xl font-medium tracking-tight">
                {project.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

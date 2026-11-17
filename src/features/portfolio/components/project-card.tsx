import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<Project["status"], string> = {
  concept: "Concept",
  "in-progress": "In progress",
  completed: "Completed",
  maintained: "Active",
};

export function ProjectCard({ project }: { project: Project }) {
  const href = project.href ?? `/portfolio/projects#${project.slug}`;

  return (
    <article
      id={project.slug}
      className="panel-hover glass-panel group relative flex h-full flex-col overflow-hidden rounded-3xl p-6"
    >
      <div className="pointer-events-none absolute -top-20 right-0 size-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <Badge variant="secondary" className="mb-3 bg-secondary/80">
            {statusLabel[project.status]}
          </Badge>
          <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
        </div>
        <Link
          href={href}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label={`Open ${project.title}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.summary}
      </p>
      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((item) => (
          <span
            key={item}
            className="rounded-lg border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

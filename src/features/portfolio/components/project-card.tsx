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
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/35 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="secondary" className="mb-3">
            {statusLabel[project.status]}
          </Badge>
          <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
        </div>
        <Link
          href={href}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
          aria-label={`Open ${project.title}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((item) => (
          <span
            key={item}
            className="rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArticleCard } from "@/features/blog/components/article-card";
import { getFeaturedArticles } from "@/features/blog/lib/articles";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import { SkillsGrid } from "@/features/portfolio/components/skills-grid";
import {
  getFeaturedProjects,
  getProfile,
  getSkills,
} from "@/features/portfolio/lib/queries";
import { getImplementedTools } from "@/features/tools/data/catalog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const upcomingHubs = [
  {
    title: "AI playground",
    description: "Interactive labs for prompts, RAG, vectors and agents.",
    href: "/labs",
  },
  {
    title: "Research highlights",
    description:
      "Including decision-impact-aware evidence adjudication research notes.",
    href: "/research",
  },
] as const;

export function HomeSections() {
  const profile = getProfile();
  const featuredProjects = getFeaturedProjects();
  const skills = getSkills();
  const articles = getFeaturedArticles(3);
  const popularTools = getImplementedTools().slice(0, 6);

  return (
    <>
      <section className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Introduction
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore. Learn. Build.
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              {profile.longBio.map((paragraph) => (
                <p key={paragraph} className="text-pretty leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
            >
              More about me
            </Link>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
            <p className="text-sm font-medium tracking-tight">Focus areas</p>
            <ul className="mt-4 space-y-3">
              {profile.focusAreas.map((area) => (
                <li
                  key={area}
                  className="border-b border-border/50 pb-3 text-sm text-muted-foreground last:border-0 last:pb-0"
                >
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              {profile.availabilityNote}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Featured projects
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Selected work in progress
              </h2>
              <p className="mt-4 text-muted-foreground">
                Project summaries stay factual. Detailed outcomes will be added
                only when verified.
              </p>
            </div>
            <Link
              href="/portfolio/projects"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              All projects
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Latest articles
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                From the technology publication
              </h2>
            </div>
            <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }))}>
              All articles
            </Link>
          </div>
          <div className="mt-10 grid gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Popular free tools
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Useful utilities, no login required
              </h2>
            </div>
            <Link href="/tools" className={cn(buttonVariants({ variant: "outline" }))}>
              Browse tools
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/40"
              >
                <h3 className="font-medium tracking-tight">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Skills
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Capabilities across the stack
            </h2>
          </div>
          <div className="mt-10">
            <SkillsGrid skills={skills} />
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Ecosystem
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tools, labs and knowledge hubs
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {upcomingHubs.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className="group rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-medium tracking-tight">
                    {hub.title}
                  </h3>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {hub.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/40 p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-ai uppercase">
              CloudCey
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Intelligent solutions for ambitious teams
            </h2>
            <p className="mt-4 text-muted-foreground">
              AI automation, business intelligence, custom software, chatbots,
              RAG applications and data engineering.
            </p>
            <Link
              href="/cloudcey"
              className={cn(buttonVariants({ size: "lg" }), "mt-8")}
            >
              Explore CloudCey
            </Link>
          </div>
          <div className="rounded-2xl border border-border/70 bg-primary/10 p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Let&apos;s build something useful
            </h2>
            <p className="mt-4 text-muted-foreground">
              For collaborations, career conversations or CloudCey inquiries,
              reach out through the contact page.
            </p>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-8"
              )}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

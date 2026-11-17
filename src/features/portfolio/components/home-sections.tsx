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
import { Reveal } from "@/components/layout/reveal";
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

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-title mt-3 text-3xl sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export async function HomeSections() {
  const [profile, featuredProjects] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
  ]);
  const skills = getSkills();
  const articles = getFeaturedArticles(3);
  const popularTools = getImplementedTools().slice(0, 6);

  return (
    <>
      <section className="relative border-t border-border/40">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="eyebrow">Introduction</p>
            <h2 className="display-title mt-3 text-3xl sm:text-4xl md:text-[2.75rem]">
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
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass-panel relative overflow-hidden rounded-3xl p-7">
              <div className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-primary/15 blur-3xl" />
              <p className="text-sm font-medium tracking-tight">Focus areas</p>
              <ul className="mt-5 space-y-0">
                {profile.focusAreas.map((area, index) => (
                  <li
                    key={area}
                    className="flex gap-3 border-b border-border/40 py-3.5 text-sm text-muted-foreground last:border-0"
                  >
                    <span className="font-mono text-[11px] text-primary/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                {profile.availabilityNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Featured projects"
              title="Selected work in progress"
              description="Project summaries stay factual. Detailed outcomes will be added only when verified."
              action={
                <Link
                  href="/portfolio/projects"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  All projects
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Latest articles"
              title="From the technology publication"
              action={
                <Link
                  href="/blog"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  All articles
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-4">
            {articles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.05}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Popular free tools"
              title="Useful utilities, no login required"
              action={
                <Link
                  href="/tools"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Browse tools
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 0.04}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="panel-hover glass-panel block rounded-2xl p-5"
                >
                  <h3 className="font-medium tracking-tight">{tool.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Skills"
              title="Capabilities across the stack"
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <SkillsGrid skills={skills} />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Ecosystem"
              title="Tools, labs and knowledge hubs"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {upcomingHubs.map((hub, index) => (
              <Reveal key={hub.href} delay={index * 0.06}>
                <Link
                  href={hub.href}
                  className="panel-hover glass-panel group block rounded-3xl p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-tight">
                      {hub.title}
                    </h3>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {hub.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
              <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-violet-ai/20 blur-3xl" />
              <p className="eyebrow text-violet-ai">CloudCey</p>
              <h2 className="display-title mt-3 text-3xl sm:text-4xl">
                Intelligent solutions for ambitious teams
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                AI automation, business intelligence, custom software, chatbots,
                RAG applications and data engineering.
              </p>
              <Link
                href="/cloudcey"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-sheen mt-8"
                )}
              >
                Explore CloudCey
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8 md:p-10">
              <div className="pointer-events-none absolute top-0 right-0 size-48 rounded-full bg-primary/20 blur-3xl" />
              <p className="eyebrow">Contact</p>
              <h2 className="display-title mt-3 text-3xl sm:text-4xl">
                Let&apos;s build something useful
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                For collaborations, career conversations or CloudCey inquiries,
                reach out through the contact page.
              </p>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-8 border-primary/30 bg-background/40 backdrop-blur-sm"
                )}
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

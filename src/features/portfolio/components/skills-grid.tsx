import { skillCategoryLabels } from "@/features/portfolio/data/content";
import type { Skill } from "@/types/portfolio";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] ??= [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className="rounded-2xl border border-border/70 bg-card/40 p-6"
        >
          <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
            {skillCategoryLabels[category] ?? category}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((skill) => (
              <li
                key={skill.id}
                className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1 text-sm text-muted-foreground"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

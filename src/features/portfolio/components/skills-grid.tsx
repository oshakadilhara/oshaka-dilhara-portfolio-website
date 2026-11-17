import { skillCategoryLabels } from "@/features/portfolio/data/content";
import type { Skill } from "@/types/portfolio";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] ??= [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="glass-panel rounded-3xl p-6">
          <h3 className="eyebrow text-[11px]">
            {skillCategoryLabels[category] ?? category}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((skill) => (
              <li
                key={skill.id}
                className="rounded-xl border border-border/60 bg-background/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground"
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

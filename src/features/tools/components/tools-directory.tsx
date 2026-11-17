"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  getImplementedTools,
  searchTools,
  toolCategories,
} from "@/features/tools/data/catalog";

export function ToolsDirectory() {
  const [query, setQuery] = useState("");
  const tools = useMemo(() => searchTools(query), [query]);

  return (
    <div className="mt-10 space-y-10">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
        aria-label="Search tools"
      />

      {toolCategories.map((category) => {
        const items = tools.filter((tool) => tool.category === category.id);
        if (items.length === 0) return null;
        return (
          <section key={category.id}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {category.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <Link
                href={`/tools/category/${category.id}`}
                className="text-sm text-primary hover:underline"
              >
                View category
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((tool) => (
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
          </section>
        );
      })}

      {tools.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tools match “{query}”. Try another keyword.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Showing {tools.length} of {getImplementedTools().length} implemented
          tools. More tools will be added in later batches.
        </p>
      )}
    </div>
  );
}

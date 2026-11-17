import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getRelatedTools, toolCategories } from "@/features/tools/data/catalog";
import type { ToolDefinition } from "@/types/tools";

export function ToolShell({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
}) {
  const category = toolCategories.find((item) => item.id === tool.category);
  const related = getRelatedTools(tool.slug);

  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          <Link href={`/tools/category/${tool.category}`}>
            {category?.title ?? tool.category}
          </Link>
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{tool.description}</p>

        <div className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-6">
          {children}
        </div>

        {tool.faqs && tool.faqs.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
            <Accordion className="mt-4" defaultValue={["faq-0"]}>
              {tool.faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Related tools</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  className="rounded-xl border border-border/70 bg-card/30 p-4 text-sm transition-colors hover:border-primary/40"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-muted-foreground">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

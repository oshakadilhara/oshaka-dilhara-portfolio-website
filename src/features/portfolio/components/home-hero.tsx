"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/constants/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden surface-grid">
      <div className="surface-mesh pointer-events-none absolute inset-0 opacity-70" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-50" />

      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[8%] hidden h-[420px] w-[420px] -translate-y-1/2 lg:block"
      >
        <div className="animate-pulse-ring absolute inset-8 rounded-full border border-primary/20" />
        <div className="animate-float-slow absolute inset-16 rounded-full border border-violet-ai/25 bg-gradient-to-br from-primary/10 via-transparent to-violet-ai/10" />
        <div className="animate-orbit absolute inset-0">
          <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
          <span className="absolute bottom-8 left-10 size-1.5 rounded-full bg-violet-ai shadow-[0_0_12px_var(--violet-ai)]" />
        </div>
        <div className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_65%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase"
        >
          <Sparkles className="size-3.5 text-violet-ai" aria-hidden />
          {siteConfig.philosophy}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="max-w-4xl display-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          <span className="text-gradient block">{siteConfig.brand}</span>
          <span className="mt-5 block max-w-3xl text-2xl font-medium tracking-tight text-foreground/95 sm:text-3xl md:text-4xl">
            {siteConfig.headline}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-11 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/portfolio"
            className={cn(buttonVariants({ size: "lg" }), "btn-sheen h-11 px-5")}
          >
            View portfolio
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/tools"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 border-border/80 bg-background/40 px-5 backdrop-blur-sm"
            )}
          >
            Explore free tools
          </Link>
          <Link
            href="/labs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "h-11 px-5 text-muted-foreground hover:text-foreground"
            )}
          >
            AI playground
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border/50 pt-6 text-xs tracking-[0.14em] text-muted-foreground uppercase"
        >
          <span>{siteConfig.tagline}</span>
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
          <span>AI · Engineering · Data</span>
        </motion.div>
      </div>
    </section>
  );
}

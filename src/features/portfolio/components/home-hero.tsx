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
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-primary uppercase"
        >
          <Sparkles className="size-3.5 text-violet-ai" aria-hidden />
          {siteConfig.philosophy}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-primary">{siteConfig.brand}</span>
          <span className="mt-4 block text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {siteConfig.headline}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link href="/portfolio" className={cn(buttonVariants({ size: "lg" }))}>
            View portfolio
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/tools"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Explore free tools
          </Link>
          <Link
            href="/labs"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
          >
            AI playground
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 text-sm tracking-wide text-muted-foreground"
        >
          {siteConfig.tagline}
        </motion.p>
      </div>
    </section>
  );
}

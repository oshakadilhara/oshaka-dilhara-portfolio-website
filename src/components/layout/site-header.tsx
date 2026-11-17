import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants/site";
import { MainNav } from "@/components/navigation/main-nav";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavFallback() {
  return <div className="hidden h-8 w-80 lg:block" aria-hidden />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="glass-nav mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 rounded-2xl px-3 sm:h-16 sm:px-5">
        <div className="flex items-center gap-5">
          <Link href="/" className="group flex items-center gap-3 leading-none">
            <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            </span>
            <span className="flex flex-col">
              <span className="text-[13px] font-semibold tracking-[0.16em] text-foreground transition-colors group-hover:text-primary">
                {siteConfig.brand}
              </span>
              <span className="mt-0.5 hidden text-[10px] tracking-[0.12em] text-muted-foreground sm:block">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>
          <Suspense fallback={<NavFallback />}>
            <MainNav />
          </Suspense>
        </div>
        <div className="flex items-center gap-1.5">
          <Suspense fallback={<div className="size-8" aria-hidden />}>
            <ThemeToggle />
          </Suspense>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "sm" }),
              "btn-sheen hidden sm:inline-flex"
            )}
          >
            Get in touch
          </Link>
          <Suspense fallback={<div className="size-8 lg:hidden" aria-hidden />}>
            <MobileNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

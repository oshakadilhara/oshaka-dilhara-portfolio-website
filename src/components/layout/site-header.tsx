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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-[0.14em] text-foreground transition-colors group-hover:text-primary">
              {siteConfig.brand}
            </span>
            <span className="mt-0.5 hidden text-[10px] tracking-wide text-muted-foreground sm:block">
              {siteConfig.tagline}
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
              "hidden sm:inline-flex"
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

import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/constants/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            </span>
            <p className="text-sm font-semibold tracking-[0.14em]">
              {siteConfig.brand}
            </p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.philosophy}
          </p>
        </div>
        {(
          [
            ["Explore", footerNav.explore],
            ["Learn", footerNav.learn],
            ["Company", footerNav.company],
          ] as const
        ).map(([label, items]) => (
          <div key={label}>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase">
              {label}
            </p>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-border/50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            {footerNav.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

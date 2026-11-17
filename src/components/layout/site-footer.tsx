import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/constants/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold tracking-[0.14em]">
            {siteConfig.brand}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
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
            <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
              {label}
            </p>
            <ul className="mt-3 space-y-2">
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
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {siteConfig.name}. All rights reserved.
          </p>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { footerNav, mainNav, moreNav, siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [...mainNav, ...moreNav];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg lg:hidden",
          "text-foreground hover:bg-muted"
        )}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)] p-0">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-semibold tracking-tight">
            {siteConfig.brand}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">{siteConfig.philosophy}</p>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
          {links.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            );
          })}
          <div className="mt-3 border-t border-border pt-3">
            {footerNav.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

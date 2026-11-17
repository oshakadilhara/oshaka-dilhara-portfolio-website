import Link from "next/link";
import { LogoutButton } from "@/features/admin/components/logout-button";
import { getAdminUser } from "@/lib/auth/session";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export async function AdminHeader() {
  const admin = await getAdminUser();

  return (
    <div className="border-b border-border/60 bg-card/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <p className="text-sm font-semibold tracking-[0.14em]">
            ADMIN · OSHAKA DILHARA
          </p>
          {admin ? (
            <nav className="hidden items-center gap-3 md:flex" aria-label="Admin">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        {admin ? (
          <div className="flex items-center gap-3">
            <p className="hidden text-xs text-muted-foreground sm:block">
              {admin.email}
            </p>
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminHeaderFallback() {
  return (
    <div className="border-b border-border/60 bg-card/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-[0.14em]">
          ADMIN · OSHAKA DILHARA
        </p>
      </div>
    </div>
  );
}

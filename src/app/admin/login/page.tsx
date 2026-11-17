import { Suspense } from "react";
import { LoginForm } from "@/features/admin/components/login-form";
import { getAdminEmails } from "@/lib/auth/admin";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Admin login",
  description: "Administrator sign-in.",
  path: "/admin/login",
  noIndex: true,
});

export const instant = false;

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

async function LoginContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const allowlistConfigured = getAdminEmails().length > 0;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-card/60 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Single-administrator access only. Public registration is disabled.
      </p>

      {!allowlistConfigured ? (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
          Set <code className="font-mono">ADMIN_EMAILS</code> in{" "}
          <code className="font-mono">.env.local</code> to your owner email,
          then create that user in the Supabase Auth dashboard. See{" "}
          <code className="font-mono">docs/ADMIN_SETUP.md</code>.
        </div>
      ) : (
        <div className="mt-8">
          <LoginForm nextPath={params.next} />
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-card/60 p-8">
          <p className="text-sm text-muted-foreground">Loading login...</p>
        </div>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

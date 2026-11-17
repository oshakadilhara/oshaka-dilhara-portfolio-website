import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageviewTracker } from "@/features/analytics/components/pageview-tracker";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}

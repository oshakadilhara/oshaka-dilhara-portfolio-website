import { Suspense } from "react";
import { HomeHero } from "@/features/portfolio/components/home-hero";
import { HomeSections } from "@/features/portfolio/components/home-sections";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground sm:px-6">
            Loading sections...
          </div>
        }
      >
        <HomeSections />
      </Suspense>
    </>
  );
}

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "CloudCey",
  description:
    "AI automation, analytics and custom software for ambitious teams.",
  path: "/cloudcey",
});

const services = [
  "AI Automation",
  "Business Intelligence",
  "Custom Software",
  "AI Chatbots",
  "RAG Applications",
  "Data Engineering",
  "Power BI Dashboards",
  "Technical Consulting",
] as const;

export default function CloudCeyPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="CloudCey"
          title="Intelligent solutions for business"
          description="CloudCey is the service brand for AI automation, analytics and custom software delivery."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-border/70 bg-card/40 px-5 py-6 text-sm font-medium tracking-tight"
            >
              {service}
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-border/70 bg-card/40 p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Start a conversation
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Share your context and goals. Inquiry forms and published case
            studies will expand as CloudCey content is managed through the
            admin dashboard.
          </p>
          <Link href="/contact" className={cn(buttonVariants(), "mt-6")}>
            Contact CloudCey
          </Link>
        </div>
      </div>
    </div>
  );
}

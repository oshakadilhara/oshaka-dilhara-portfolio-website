import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Reach out for collaboration, consulting or career conversations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          description="For collaborations, technical conversations or CloudCey inquiries."
        />
        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-border/70 bg-card/40 p-8">
          <p className="text-sm text-muted-foreground">
            A secure contact form connected to Supabase will be enabled with the
            admin messaging workflow. Until then, use the public contact email
            once configured in site settings.
          </p>
          <p className="mt-6 text-sm">
            <span className="text-muted-foreground">Intended contact:</span>{" "}
            <span className="font-medium">{siteConfig.email}</span>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Update this address through admin settings before production launch
            if a different inbox should be public.
          </p>
        </div>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms for using this technology portal and its free tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Legal"
          title="Terms of use"
          description="Terms for using this technology portal and its free tools."
        />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Free tools and labs are provided as-is for learning and productivity.
            Do not upload confidential data you are not allowed to process in a
            browser.
          </p>
          <p>
            Sri Lankan salary, tax, and utility helpers use dated illustrative
            assumptions and are not official legal or financial advice.
          </p>
          <p>
            You may not attempt to bypass administrator access controls, scrape
            private surfaces, or overload the contact form.
          </p>
          <p>
            Contact:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

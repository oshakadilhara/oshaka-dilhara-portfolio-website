import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/features/contact/components/contact-form";
import { FeedbackForm } from "@/features/contact/components/feedback-form";
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
        <div className="mx-auto mt-14 grid max-w-3xl gap-10">
          <ContactForm />
          <div className="rounded-2xl border border-border/70 bg-card/40 p-8">
            <FeedbackForm />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Prefer email?{" "}
            <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

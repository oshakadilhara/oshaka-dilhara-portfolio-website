import { PageHeader } from "@/components/layout/page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: "How this platform handles information and visitor privacy.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="surface-grid">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <PageHeader
          eyebrow="Legal"
          title="Privacy policy"
          description="How this platform handles information and visitor privacy."
        />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            This site is operated by {siteConfig.name}. Public tools run in your
            browser whenever practical and do not require an account.
          </p>
          <p>
            If you use the contact form, we store your name, email, message, and
            limited technical metadata (such as a hashed IP and user agent) to
            prevent abuse and reply to you. Messages are not sold.
          </p>
          <p>
            Administrator authentication uses Supabase Auth. Only explicitly
            allowlisted administrator emails may access `/admin`.
          </p>
          <p>
            Questions:{" "}
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

"use server";

import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getRequestIp, getUserAgent } from "@/lib/security/request";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { contactSchema } from "@/lib/validations/contact";

export type ContactActionState = {
  error?: string;
  success?: boolean;
};

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const ip = await getRequestIp();
  const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.success) {
    return {
      error: "Too many messages from this network. Please try again later.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || "",
    message: formData.get("message"),
    company: formData.get("company") || "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid contact details.",
    };
  }

  // Honeypot tripped — pretend success to avoid tipping off bots.
  if (parsed.data.company) {
    return { success: true };
  }

  const name = sanitizePlainText(parsed.data.name, 120);
  const email = sanitizePlainText(parsed.data.email.toLowerCase(), 254);
  const subject = sanitizePlainText(parsed.data.subject || "", 200) || null;
  const message = sanitizePlainText(parsed.data.message, 5000);
  const userAgent = await getUserAgent();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      source: "contact",
      ip_hash: hashIp(ip),
      user_agent: userAgent,
    });

    if (error) {
      console.warn("[contact]", error.message);
      return {
        error:
          "Unable to send your message right now. Please email hello@oshakadilhara.com instead.",
      };
    }

    return { success: true };
  } catch {
    return {
      error:
        "Contact storage is not available yet. Please email hello@oshakadilhara.com.",
    };
  }
}

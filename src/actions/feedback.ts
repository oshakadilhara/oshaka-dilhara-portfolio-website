"use server";

import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getRequestIp } from "@/lib/security/request";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { z } from "zod";

export type FeedbackActionState = {
  error?: string;
  success?: boolean;
};

const feedbackSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  page_path: z.string().trim().max(300).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
});

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function submitFeedback(
  _prevState: FeedbackActionState,
  formData: FormData
): Promise<FeedbackActionState> {
  const ip = await getRequestIp();
  const limited = rateLimit(`feedback:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.success) {
    return { error: "Too many feedback submissions. Try again later." };
  }

  const ratingRaw = formData.get("rating");
  const parsed = feedbackSchema.safeParse({
    message: formData.get("message"),
    rating: ratingRaw ? ratingRaw : undefined,
    page_path: formData.get("page_path") || "",
    company: formData.get("company") || "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid feedback.",
    };
  }

  if (parsed.data.company) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("feedback").insert({
      message: sanitizePlainText(parsed.data.message, 2000),
      rating: parsed.data.rating ?? null,
      page_path: sanitizePlainText(parsed.data.page_path || "", 300) || null,
      ip_hash: hashIp(ip),
    });

    if (error) {
      console.warn("[feedback]", error.message);
      return { error: "Unable to submit feedback right now." };
    }

    return { success: true };
  } catch {
    return { error: "Feedback storage is not available yet." };
  }
}

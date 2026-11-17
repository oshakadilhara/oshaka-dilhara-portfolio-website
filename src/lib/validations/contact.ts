import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email is too long."),
  subject: z.string().trim().max(200, "Subject is too long.").default(""),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  // Honeypot — must stay empty for real humans.
  company: z.string().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

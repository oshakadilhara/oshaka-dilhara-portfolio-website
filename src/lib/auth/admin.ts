/**
 * Explicit administrator allowlist.
 * Users cannot assign themselves admin permissions.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export function assertAdminConfigured() {
  if (getAdminEmails().length === 0) {
    throw new Error(
      "ADMIN_EMAILS is not configured. Add the owner email to .env.local."
    );
  }
}

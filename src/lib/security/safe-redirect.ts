/** Only allow in-app admin redirects (open-redirect protection). */
export function safeAdminNextPath(raw: unknown, fallback = "/admin/dashboard") {
  const nextPath = String(raw ?? fallback);
  if (
    nextPath.startsWith("/admin") &&
    !nextPath.startsWith("/admin/login") &&
    !nextPath.includes("://") &&
    !nextPath.includes("\\")
  ) {
    return nextPath;
  }
  return fallback;
}

/** Escape text for safe HTML interpolation. */
export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip control characters and normalize whitespace for stored messages. */
export function sanitizePlainText(input: string, maxLength: number) {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Allow only http(s) and relative paths for markdown links. */
export function sanitizeHref(href: string | undefined | null) {
  if (!href) return undefined;
  const value = href.trim();
  if (
    value.startsWith("/") ||
    value.startsWith("#") ||
    /^https?:\/\//i.test(value) ||
    /^mailto:/i.test(value)
  ) {
    return value;
  }
  return undefined;
}

/**
 * Very small markdown → HTML preview that escapes raw HTML first.
 * Prevents script injection via local tools preview.
 */
export function safeMarkdownPreview(markdown: string) {
  const escaped = escapeHtml(markdown);
  return escaped
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/`(.*?)`/gim, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}

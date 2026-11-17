import { headers } from "next/headers";

/** Best-effort client IP from platform / proxy headers. */
export async function getRequestIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return h.get("x-real-ip")?.trim() || h.get("cf-connecting-ip")?.trim() || "unknown";
}

export async function getUserAgent() {
  const h = await headers();
  return h.get("user-agent")?.slice(0, 500) ?? null;
}

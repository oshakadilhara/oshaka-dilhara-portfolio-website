"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/actions/admin/analytics";

export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    void trackAnalyticsEvent({
      event_name: "pageview",
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [pathname]);

  return null;
}

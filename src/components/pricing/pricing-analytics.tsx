"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

// Fires pricing_page_view on mount and scroll_depth at 25/50/75/100%,
// each threshold at most once per page view.
export function PricingAnalytics() {
  useEffect(() => {
    track("pricing_page_view");

    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const percent =
        scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          track("scroll_depth", { depth: threshold });
        }
      }
      if (fired.size === 4) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

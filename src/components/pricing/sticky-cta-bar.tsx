"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingCta } from "./pricing-cta";

// Mobile-only sticky bar. Appears once the user scrolls past the ladder
// (sentinel #pricing-ladder-end), hides while the footer is in view so it
// never overlaps it, and can be dismissed. Slides in via transform only, so
// it causes no layout shift.
export function StickyCtaBar() {
  const [pastLadder, setPastLadder] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("pricing-ladder-end");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastLadder(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (dismissed) return null;

  const visible = pastLadder && !footerVisible;

  return (
    <div
      inert={!visible || undefined}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 transition-transform duration-300 md:hidden print:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium tabular-nums">
            Diagnostic £950{" "}
            <span className="font-normal text-muted-foreground">ex VAT</span>
          </p>
          {/* Short by necessity — the bar has room for one line beside the
              button at 375px. The full "not a payment" line lives on /pricing. */}
          <p className="text-xs text-muted-foreground">A call, not a payment</p>
        </div>
        <PricingCta
          position="sticky"
          size="default"
          className="ml-auto shrink-0"
        />
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

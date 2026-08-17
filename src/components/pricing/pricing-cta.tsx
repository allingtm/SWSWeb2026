"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";

export type PricingCtaPosition = "ladder" | "examples" | "closing" | "sticky";

interface PricingCtaProps {
  position: PricingCtaPosition;
  size?: "default" | "lg";
  className?: string;
}

export function PricingCta({ position, size = "lg", className }: PricingCtaProps) {
  return (
    <Button asChild size={size} className={className}>
      <Link
        href="/book-diagnostic"
        onClick={() => track("cta_click", { position })}
      >
        Book a diagnostic
      </Link>
    </Button>
  );
}

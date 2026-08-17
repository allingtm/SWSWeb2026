"use client";

import { Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DiagnosticCallPosition = "booking-card" | "closing";

interface DiagnosticCallButtonProps {
  phone: string;
  position: DiagnosticCallPosition;
  className?: string;
}

// Tracked call button for the booking page — the primary completion path, so
// it reports which instance was used. The page-view event lives in
// DiagnosticAnalytics.
export function DiagnosticCallButton({
  phone,
  position,
  className,
}: DiagnosticCallButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      className={cn("h-12 w-full gap-2 px-6 text-base", className)}
    >
      <a
        href={`tel:${phone.replace(/-/g, "")}`}
        onClick={() => track("diagnostic_call_click", { position })}
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call {phone}
      </a>
    </Button>
  );
}

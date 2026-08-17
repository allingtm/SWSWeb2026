"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";

interface PricingFaqItemProps {
  id: string;
  question: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

// Native <details>/<summary> so the FAQ stays fully usable (and every answer
// stays in the initial HTML) with JavaScript disabled. JS only adds analytics
// and expand-all-on-print behaviour.
export function PricingFaqItem({
  id,
  question,
  defaultOpen = false,
  children,
}: PricingFaqItemProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const prevOpen = useRef(defaultOpen);
  const printing = useRef(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    let wasOpen = details.open;
    const handleBeforePrint = () => {
      printing.current = true;
      wasOpen = details.open;
      details.open = true;
    };
    const handleAfterPrint = () => {
      details.open = wasOpen;
      printing.current = false;
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      open={defaultOpen}
      className="group border-b border-border"
      onToggle={(e) => {
        const open = e.currentTarget.open;
        setIsOpen(open);
        if (open && !prevOpen.current && !printing.current) {
          track("faq_open", { question });
        }
        prevOpen.current = open;
      }}
    >
      <summary
        aria-expanded={isOpen}
        aria-controls={id}
        className="flex min-h-[44px] w-full cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
      >
        <h3 className="text-base font-medium md:text-lg">{question}</h3>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div id={id} className="pb-5 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </details>
  );
}

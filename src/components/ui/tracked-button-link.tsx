"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { Button, type ButtonProps } from "./button";
import { opensInNewTab, type EventProps } from "./tracked-link";

interface TrackedButtonLinkProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  children: React.ReactNode;
  /** Vercel Analytics custom event name, e.g. "about_cta_click". */
  event: string;
  /** Optional properties recorded alongside the event. */
  eventProps?: EventProps;
  /** Render a plain anchor instead of a Next.js Link. */
  external?: boolean;
}

// ButtonLink with a Vercel Analytics event attached. Use for any CTA whose
// click-through we want to measure; plain ButtonLink remains fine for
// navigation we do not report on.
export function TrackedButtonLink({
  href,
  children,
  event,
  eventProps,
  external,
  onClick,
  ...props
}: TrackedButtonLinkProps) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    track(event, eventProps);
    onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  if (external) {
    const newTab = opensInNewTab(href);
    return (
      <Button asChild {...props}>
        <a
          href={href}
          onClick={handleClick}
          {...(newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild {...props}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}

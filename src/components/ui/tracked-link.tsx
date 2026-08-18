"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export type EventProps = Record<string, string | number | boolean | null>;

// tel:, mailto: and sms: hand off to another application, so target="_blank"
// on them just leaves an empty window behind on desktop.
export const opensInNewTab = (href: string) =>
  !/^(tel:|mailto:|sms:)/i.test(href);

interface TrackedLinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "onClick"
  > {
  href: string;
  children: React.ReactNode;
  /** Vercel Analytics custom event name, e.g. "contact_channel_click". */
  event: string;
  /** Optional properties recorded alongside the event. */
  eventProps?: EventProps;
  /** Render a plain anchor instead of a Next.js Link. */
  external?: boolean;
}

// Inline link with a Vercel Analytics event attached — the text-link
// counterpart to TrackedButtonLink, for links we want to measure but not
// style as buttons.
export function TrackedLink({
  href,
  children,
  event,
  eventProps,
  external,
  ...props
}: TrackedLinkProps) {
  const handleClick = () => track(event, eventProps);

  if (external) {
    const newTab = opensInNewTab(href);
    return (
      <a
        href={href}
        onClick={handleClick}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

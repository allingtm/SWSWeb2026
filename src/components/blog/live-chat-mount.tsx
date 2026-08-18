"use client";

import dynamic from "next/dynamic";

// Lazy-load live chat floating button (client-only, needs presence check)
const LiveChatFloatingButton = dynamic(
  () => import("./live-chat-widget").then((mod) => mod.LiveChatFloatingButton),
  { ssr: false }
);

interface LiveChatMountProps {
  title?: string;
  description?: string;
}

/**
 * Mounts the floating live chat button on pages without a post context.
 * The button renders nothing unless an admin is online and the visitor
 * is not blocked.
 */
export function LiveChatMount({ title = "Chat with us", description }: LiveChatMountProps) {
  return <LiveChatFloatingButton title={title} description={description} />;
}

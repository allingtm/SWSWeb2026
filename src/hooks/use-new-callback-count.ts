"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CALLBACKS_CHANGED_EVENT } from "@/lib/diagnostic-callbacks";

const POLL_INTERVAL_MS = 60_000;

/**
 * Count of unworked ("new") diagnostic callback requests, for the sidebar badge.
 *
 * Refreshes on mount, on navigation, on a 60s poll, and whenever the callbacks
 * page broadcasts a change - so working through the list updates the badge right
 * away rather than after the next poll.
 */
export function useNewCallbackCount(): number {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/admin/diagnostic-callbacks/count", {
        signal,
      });

      if (!response.ok) return;

      const data = await response.json();
      if (!signal?.aborted) {
        setCount(typeof data.new === "number" ? data.new : 0);
      }
    } catch {
      // Badge is non-critical - a failed poll just leaves the last known count.
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const tick = () => {
      void refresh(controller.signal);
    };

    // Deferred rather than called inline: every state update from this effect
    // then lands in a callback, keeping it out of the effect body itself.
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    window.addEventListener(CALLBACKS_CHANGED_EVENT, tick);

    return () => {
      controller.abort();
      clearTimeout(initial);
      clearInterval(interval);
      window.removeEventListener(CALLBACKS_CHANGED_EVENT, tick);
    };
  }, [refresh, pathname]);

  return count;
}

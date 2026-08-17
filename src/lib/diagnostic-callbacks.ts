import type { DiagnosticCallbackStatus } from "@/types";

// Shared between the admin API routes and the admin UI so the allowed workflow
// statuses can't drift apart. Mirrors the DB check constraint on
// sws2026_diagnostic_callbacks.status.
export const CALLBACK_STATUSES = [
  "new",
  "contacted",
  "booked",
  "archived",
] as const satisfies readonly DiagnosticCallbackStatus[];

export const CALLBACK_STATUS_LABELS: Record<DiagnosticCallbackStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  archived: "Archived",
};

// Guards the notes textarea against unbounded input; enforced server-side and
// surfaced as a counter in the UI.
export const MAX_CALLBACK_NOTES_LENGTH = 5000;

// The sidebar badge lives outside the callbacks page's React tree, so mutations
// there broadcast on this event to refresh the count immediately instead of
// leaving it stale until the next poll.
export const CALLBACKS_CHANGED_EVENT = "diagnostic-callbacks:changed";

export function notifyCallbacksChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CALLBACKS_CHANGED_EVENT));
  }
}

export function isCallbackStatus(
  value: unknown
): value is DiagnosticCallbackStatus {
  return (
    typeof value === "string" &&
    (CALLBACK_STATUSES as readonly string[]).includes(value)
  );
}

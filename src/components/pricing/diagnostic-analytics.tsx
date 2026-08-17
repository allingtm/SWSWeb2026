"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

// Fires diagnostic_page_view once on mount. Split out of DiagnosticCallButton
// so the call button can appear more than once on the page without the
// page-view event firing per instance.
export function DiagnosticAnalytics() {
  useEffect(() => {
    track("diagnostic_page_view");
  }, []);

  return null;
}

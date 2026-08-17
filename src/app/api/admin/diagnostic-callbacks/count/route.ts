import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNewDiagnosticCallbackCount } from "@/lib/supabase/queries/diagnostic-callbacks";

// Polled by the admin sidebar badge, so it stays deliberately cheap: a single
// head count rather than the full list + per-status breakdown.
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newCount = await getNewDiagnosticCallbackCount();

    return NextResponse.json({ new: newCount });
  } catch (error) {
    console.error("Error counting new diagnostic callbacks:", error);
    return NextResponse.json(
      { error: "Failed to count new diagnostic callbacks" },
      { status: 500 }
    );
  }
}

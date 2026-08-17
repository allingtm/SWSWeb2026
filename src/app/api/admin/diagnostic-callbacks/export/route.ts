import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllDiagnosticCallbacks } from "@/lib/supabase/queries/diagnostic-callbacks";
import { isCallbackStatus } from "@/lib/diagnostic-callbacks";

// POST rather than GET for CSRF protection, matching the enquiries export.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: author } = await supabase
      .from("sws2026_blog_authors")
      .select("can_export")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!author?.can_export) {
      return NextResponse.json(
        { error: "Export permission denied" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const { callbacks } = await getAllDiagnosticCallbacks({
      status: isCallbackStatus(body.status) ? body.status : undefined,
      dateFrom: body.dateFrom || undefined,
      dateTo: body.dateTo || undefined,
    });

    const headers = [
      "ID",
      "Name",
      "Company",
      "Phone",
      "Best Time To Call",
      "Status",
      "Notes",
      "Source URL",
      "Created At",
    ];

    const rows = callbacks.map((callback) => [
      callback.id,
      callback.name,
      callback.company || "",
      callback.phone,
      callback.best_time || "",
      callback.status,
      callback.notes || "",
      callback.source_url || "",
      new Date(callback.created_at).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell);
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      ),
    ].join("\n");

    const filename = `diagnostic-callbacks-export-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting diagnostic callbacks:", error);
    return NextResponse.json(
      { error: "Failed to export diagnostic callbacks" },
      { status: 500 }
    );
  }
}

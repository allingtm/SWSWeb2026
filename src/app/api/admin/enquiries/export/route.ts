import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllEnquiries } from "@/lib/supabase/queries/enquiries";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get("surveyId") || undefined;
    const postId = searchParams.get("postId") || undefined;
    const status = searchParams.get("status") as 'new' | 'read' | 'archived' | null;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const { enquiries } = await getAllEnquiries({
      surveyId,
      postId,
      status: status || undefined,
      dateFrom,
      dateTo,
    });

    // Build CSV
    const headers = [
      "ID",
      "Survey",
      "Post",
      "Respondent Name",
      "Respondent Email",
      "Status",
      "Created At",
      "Response Data",
    ];

    const rows = enquiries.map((enquiry) => [
      enquiry.id,
      enquiry.survey?.name || "",
      enquiry.post?.title || "",
      enquiry.respondent_name || "",
      enquiry.respondent_email || "",
      enquiry.status,
      new Date(enquiry.created_at).toISOString(),
      JSON.stringify(enquiry.response_data),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell);
            // Escape quotes and wrap in quotes if contains comma or quote
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      ),
    ].join("\n");

    const filename = `enquiries-export-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting enquiries:", error);
    return NextResponse.json(
      { error: "Failed to export enquiries" },
      { status: 500 }
    );
  }
}

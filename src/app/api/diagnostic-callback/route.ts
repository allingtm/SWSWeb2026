import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email";

interface CallbackFormData {
  name: string;
  company?: string;
  phone: string;
  bestTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackFormData = await request.json();

    // Validate required fields
    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic phone sanity check: at least 7 digits
    const digits = body.phone.replace(/\D/g, "");
    if (digits.length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error: dbError } = await supabase
      .from("sws2026_diagnostic_callbacks")
      .insert({
        name: body.name.trim(),
        company: body.company?.trim() || null,
        phone: body.phone.trim(),
        best_time: body.bestTime?.trim() || null,
        source_url: request.headers.get("referer") || "/book-diagnostic",
        user_agent: request.headers.get("user-agent") || null,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the request if DB insert fails - we can still send email
    }

    // Send email notification
    const emailSent = await sendEmail({
      to: "marc@solvewithsoftware.com",
      subject: `Diagnostic callback request: ${body.name}${body.company ? ` from ${body.company}` : ""}`,
      html: `
        <h2>Diagnostic Callback Request</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ""}
        <p><strong>Phone:</strong> ${body.phone}</p>
        ${body.bestTime ? `<p><strong>Best time to call:</strong> ${body.bestTime}</p>` : ""}
      `,
    });

    // Either path alone is enough to reach us (admin list or inbox), but if both
    // failed the lead is lost - tell the visitor so they can call or retry.
    if (dbError && !emailSent) {
      return NextResponse.json(
        { error: "We couldn't save your request. Please call us instead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Diagnostic callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

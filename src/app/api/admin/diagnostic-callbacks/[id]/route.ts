import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDiagnosticCallbackById } from "@/lib/supabase/queries/diagnostic-callbacks";
import {
  updateDiagnosticCallback,
  deleteDiagnosticCallback,
  type DiagnosticCallbackUpdate,
} from "@/lib/supabase/mutations/diagnostic-callbacks";
import {
  CALLBACK_STATUSES,
  MAX_CALLBACK_NOTES_LENGTH,
  isCallbackStatus,
} from "@/lib/diagnostic-callbacks";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const callback = await getDiagnosticCallbackById(id);

    if (!callback) {
      return NextResponse.json(
        { error: "Diagnostic callback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ callback });
  } catch (error) {
    console.error("Error fetching diagnostic callback:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnostic callback" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updates: DiagnosticCallbackUpdate = {};

    if (body.status !== undefined) {
      if (!isCallbackStatus(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Expected one of: ${CALLBACK_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.notes !== undefined) {
      if (body.notes !== null && typeof body.notes !== "string") {
        return NextResponse.json(
          { error: "Notes must be a string or null" },
          { status: 400 }
        );
      }

      const trimmed = typeof body.notes === "string" ? body.notes.trim() : "";

      if (trimmed.length > MAX_CALLBACK_NOTES_LENGTH) {
        return NextResponse.json(
          { error: `Notes must be ${MAX_CALLBACK_NOTES_LENGTH} characters or fewer` },
          { status: 400 }
        );
      }

      // Store an emptied-out textarea as NULL rather than an empty string.
      updates.notes = trimmed || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update. Provide status and/or notes." },
        { status: 400 }
      );
    }

    const { success, error } = await updateDiagnosticCallback(id, updates);

    if (!success) {
      return NextResponse.json(
        { error: error || "Failed to update diagnostic callback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating diagnostic callback:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic callback" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { success, error } = await deleteDiagnosticCallback(id);

    if (!success) {
      return NextResponse.json(
        { error: error || "Failed to delete diagnostic callback" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting diagnostic callback:", error);
    return NextResponse.json(
      { error: "Failed to delete diagnostic callback" },
      { status: 500 }
    );
  }
}

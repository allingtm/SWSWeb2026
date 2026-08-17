import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getAllDiagnosticCallbacks,
  getDiagnosticCallbackCounts,
} from "@/lib/supabase/queries/diagnostic-callbacks";
import {
  bulkUpdateDiagnosticCallbackStatus,
  bulkDeleteDiagnosticCallbacks,
} from "@/lib/supabase/mutations/diagnostic-callbacks";
import { CALLBACK_STATUSES, isCallbackStatus } from "@/lib/diagnostic-callbacks";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    const [callbacksResult, counts] = await Promise.all([
      getAllDiagnosticCallbacks({
        status: isCallbackStatus(statusParam) ? statusParam : undefined,
        dateFrom,
        dateTo,
        limit,
        offset,
      }),
      getDiagnosticCallbackCounts(),
    ]);

    return NextResponse.json({
      callbacks: callbacksResult.callbacks,
      total: callbacksResult.total,
      counts,
    });
  } catch (error) {
    console.error("Error fetching diagnostic callbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnostic callbacks" },
      { status: 500 }
    );
  }
}

// Bulk status update
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid ids array" },
        { status: 400 }
      );
    }

    if (!isCallbackStatus(status)) {
      return NextResponse.json(
        { error: `Invalid status. Expected one of: ${CALLBACK_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const { success, error } = await bulkUpdateDiagnosticCallbackStatus(ids, status);

    if (!success) {
      return NextResponse.json(
        { error: error || "Failed to update diagnostic callbacks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating diagnostic callbacks:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic callbacks" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid ids array" },
        { status: 400 }
      );
    }

    const { success, error } = await bulkDeleteDiagnosticCallbacks(ids);

    if (!success) {
      return NextResponse.json(
        { error: error || "Failed to delete diagnostic callbacks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting diagnostic callbacks:", error);
    return NextResponse.json(
      { error: "Failed to delete diagnostic callbacks" },
      { status: 500 }
    );
  }
}

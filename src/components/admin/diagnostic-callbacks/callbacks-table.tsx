"use client";

import { useState } from "react";
import { Eye, Phone, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CALLBACK_STATUSES,
  CALLBACK_STATUS_LABELS,
  notifyCallbacksChanged,
} from "@/lib/diagnostic-callbacks";
import type { DiagnosticCallback, DiagnosticCallbackStatus } from "@/types";
import { CallbackDetailModal } from "./callback-detail-modal";
import { CallbackStatusBadge } from "./callback-status-badge";
import { telHref } from "./tel-href";

interface CallbacksTableProps {
  callbacks: DiagnosticCallback[];
  onRefresh: () => void;
}

export function CallbacksTable({ callbacks, onRefresh }: CallbacksTableProps) {
  const [selectedCallback, setSelectedCallback] =
    useState<DiagnosticCallback | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === callbacks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(callbacks.map((c) => c.id)));
    }
  };

  const handleBulkStatusChange = async (status: DiagnosticCallbackStatus) => {
    if (selectedIds.size === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/diagnostic-callbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update callbacks");
      }

      setSelectedIds(new Set());
      notifyCallbacksChanged();
      onRefresh();
    } catch (error) {
      console.error("Error updating callbacks:", error);
      alert("Failed to update callback requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (
      !confirm(
        `Delete ${selectedIds.size} callback request${selectedIds.size === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/diagnostic-callbacks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete callbacks");
      }

      setSelectedIds(new Set());
      notifyCallbacksChanged();
      onRefresh();
    } catch (error) {
      console.error("Error deleting callbacks:", error);
      alert("Failed to delete callback requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: DiagnosticCallbackStatus
  ) => {
    try {
      const response = await fetch(`/api/admin/diagnostic-callbacks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      notifyCallbacksChanged();
      onRefresh();
    } catch (error) {
      console.error("Error updating callback:", error);
      alert("Failed to update status");
    }
  };

  // Returns whether the save succeeded so the modal can show inline feedback
  // instead of an alert() interrupting note-taking.
  const handleNotesChange = async (
    id: string,
    notes: string | null
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/diagnostic-callbacks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      onRefresh();
      return true;
    } catch (error) {
      console.error("Error saving notes:", error);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/diagnostic-callbacks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete callback");
      }

      setSelectedCallback(null);
      notifyCallbacksChanged();
      onRefresh();
    } catch (error) {
      console.error("Error deleting callback:", error);
      alert("Failed to delete callback request");
    }
  };

  if (callbacks.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No callback requests found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Requests appear here when visitors use the callback form on
          /book-diagnostic
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-primary/10 rounded-lg mb-4">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          {CALLBACK_STATUSES.filter((status) => status !== "new").map(
            (status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange(status)}
                disabled={isLoading}
              >
                Mark {CALLBACK_STATUS_LABELS[status]}
              </Button>
            )
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-12 py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.size === callbacks.length}
                  onChange={toggleSelectAll}
                  className="rounded border-input"
                  aria-label="Select all callback requests"
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Phone
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Best time
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Received
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {callbacks.map((callback) => (
              <tr
                key={callback.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  callback.status === "new"
                    ? "bg-blue-50/50 dark:bg-blue-950/20"
                    : ""
                }`}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(callback.id)}
                    onChange={() => toggleSelect(callback.id)}
                    className="rounded border-input"
                    aria-label={`Select callback request from ${callback.name}`}
                  />
                </td>
                <td className="py-3 px-4">
                  <p className="flex items-center gap-1.5 font-medium">
                    {callback.name}
                    {callback.notes && (
                      <StickyNote
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-label="Has call notes"
                      />
                    )}
                  </p>
                  {callback.company && (
                    <p className="text-sm text-muted-foreground">
                      {callback.company}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <a
                    href={telHref(callback.phone)}
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {callback.phone}
                  </a>
                </td>
                <td className="py-3 px-4 text-sm">
                  {callback.best_time || (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <CallbackStatusBadge status={callback.status} />
                </td>
                <td className="py-3 px-4 text-muted-foreground text-sm">
                  {new Date(callback.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCallback(callback)}
                      aria-label={`View callback request from ${callback.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedCallback && (
        <CallbackDetailModal
          key={selectedCallback.id}
          callback={selectedCallback}
          isOpen={!!selectedCallback}
          onClose={() => setSelectedCallback(null)}
          onStatusChange={(status) => {
            handleStatusChange(selectedCallback.id, status);
            setSelectedCallback({ ...selectedCallback, status });
          }}
          onNotesChange={async (notes) => {
            const ok = await handleNotesChange(selectedCallback.id, notes);
            if (ok) {
              // Keep the modal's saved-notes baseline in step so blurring again
              // doesn't re-save unchanged text.
              setSelectedCallback({ ...selectedCallback, notes });
            }
            return ok;
          }}
          onDelete={() => handleDelete(selectedCallback.id)}
        />
      )}
    </>
  );
}

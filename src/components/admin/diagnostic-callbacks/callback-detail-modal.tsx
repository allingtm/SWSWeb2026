"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  Check,
  Clock,
  Globe,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CALLBACK_STATUSES,
  CALLBACK_STATUS_LABELS,
  MAX_CALLBACK_NOTES_LENGTH,
} from "@/lib/diagnostic-callbacks";
import type { DiagnosticCallback, DiagnosticCallbackStatus } from "@/types";
import { telHref } from "./tel-href";

interface CallbackDetailModalProps {
  callback: DiagnosticCallback;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: DiagnosticCallbackStatus) => void;
  onNotesChange: (notes: string | null) => Promise<boolean>;
  onDelete: () => void;
}

type NotesState = "idle" | "saving" | "saved" | "error";

export function CallbackDetailModal({
  callback,
  isOpen,
  onClose,
  onStatusChange,
  onNotesChange,
  onDelete,
}: CallbackDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [notes, setNotes] = useState(callback.notes ?? "");
  const [notesState, setNotesState] = useState<NotesState>("idle");

  if (!isOpen) return null;

  // Saved on blur rather than with an explicit button: notes get jotted down
  // mid-call, and clicking away shouldn't lose them.
  const handleNotesBlur = async () => {
    const trimmed = notes.trim();

    if (trimmed === (callback.notes ?? "")) {
      setNotesState("idle");
      return;
    }

    setNotesState("saving");
    const ok = await onNotesChange(trimmed || null);
    setNotesState(ok ? "saved" : "error");
  };

  const handleDelete = () => {
    if (!confirm("Delete this callback request? This cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    onDelete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-background rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Callback Request</h2>
            <p className="text-sm text-muted-foreground">
              Diagnostic booking &middot;{" "}
              {new Date(callback.created_at).toLocaleString()}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Call this person — the primary action for this record */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Call back on</p>
            <a
              href={telHref(callback.phone)}
              className="mt-1 inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-primary hover:underline"
            >
              <Phone className="h-5 w-5" />
              {callback.phone}
            </a>
            {callback.best_time && (
              <p className="mt-3 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Best time:</span>
                <span className="font-medium">{callback.best_time}</span>
              </p>
            )}
          </div>

          {/* Details */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 bg-muted/50 font-medium text-sm w-1/3">
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Name
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{callback.name}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 bg-muted/50 font-medium text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Company
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {callback.company || (
                      <span className="text-muted-foreground">Not given</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 bg-muted/50 font-medium text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Received
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(callback.created_at).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-2 bg-muted/50 font-medium text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      Source
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm break-all">
                    {callback.source_url || (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Call notes */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label htmlFor="callback-notes" className="font-medium text-sm">
                Call notes
              </label>
              <span className="text-xs text-muted-foreground" aria-live="polite">
                {notesState === "saving" && "Saving..."}
                {notesState === "saved" && (
                  <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Check className="h-3 w-3" />
                    Saved
                  </span>
                )}
                {notesState === "error" && (
                  <span className="text-destructive">Not saved - try again</span>
                )}
                {notesState === "idle" &&
                  `${notes.length}/${MAX_CALLBACK_NOTES_LENGTH}`}
              </span>
            </div>
            <textarea
              id="callback-notes"
              value={notes}
              maxLength={MAX_CALLBACK_NOTES_LENGTH}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesState("idle");
              }}
              onBlur={handleNotesBlur}
              rows={4}
              placeholder="What was discussed, what happens next..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Saved automatically when you click away.
            </p>
          </div>

          {callback.user_agent && (
            <div>
              <h3 className="font-medium mb-2 text-sm">User agent</h3>
              <p className="text-xs text-muted-foreground break-all bg-muted/50 rounded-md p-3">
                {callback.user_agent}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <label
              htmlFor="callback-detail-status"
              className="text-sm text-muted-foreground"
            >
              Status:
            </label>
            <select
              id="callback-detail-status"
              value={callback.status}
              onChange={(e) =>
                onStatusChange(e.target.value as DiagnosticCallbackStatus)
              }
              className="h-8 px-2 rounded-md border border-input bg-background text-sm"
            >
              {CALLBACK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {CALLBACK_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

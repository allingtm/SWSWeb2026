import { Archive, CalendarCheck, Circle, PhoneOutgoing } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALLBACK_STATUS_LABELS } from "@/lib/diagnostic-callbacks";
import type { DiagnosticCallbackStatus } from "@/types";

const statusStyles: Record<DiagnosticCallbackStatus, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  booked: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const statusIcons: Record<
  DiagnosticCallbackStatus,
  typeof Circle
> = {
  new: Circle,
  contacted: PhoneOutgoing,
  booked: CalendarCheck,
  archived: Archive,
};

export function CallbackStatusBadge({
  status,
  className,
}: {
  status: DiagnosticCallbackStatus;
  className?: string;
}) {
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {CALLBACK_STATUS_LABELS[status]}
    </span>
  );
}

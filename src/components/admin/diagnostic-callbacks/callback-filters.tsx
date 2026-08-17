"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CALLBACK_STATUSES,
  CALLBACK_STATUS_LABELS,
} from "@/lib/diagnostic-callbacks";

export interface CallbackFilterValues {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface CallbackFiltersProps {
  initialStatus?: string;
  onFilterChange: (filters: CallbackFilterValues) => void;
  onExport: () => void;
}

export function CallbackFilters({
  initialStatus = "",
  onFilterChange,
  onExport,
}: CallbackFiltersProps) {
  const [filters, setFilters] = useState({
    status: initialStatus,
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange({
      status: newFilters.status || undefined,
      dateFrom: newFilters.dateFrom || undefined,
      dateTo: newFilters.dateTo || undefined,
    });
  };

  const handleClear = () => {
    setFilters({ status: "", dateFrom: "", dateTo: "" });
    onFilterChange({});
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="min-w-40">
        <label htmlFor="callback-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="callback-status"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Statuses</option>
          {CALLBACK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CALLBACK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="callback-date-from" className="sr-only">
          From date
        </label>
        <Input
          id="callback-date-from"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
          className="h-9 w-36"
        />
        <span className="text-muted-foreground">to</span>
        <label htmlFor="callback-date-to" className="sr-only">
          To date
        </label>
        <Input
          id="callback-date-to"
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleChange("dateTo", e.target.value)}
          className="h-9 w-36"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}

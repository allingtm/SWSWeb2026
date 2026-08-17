"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Archive,
  CalendarCheck,
  CircleDot,
  PhoneCall,
  PhoneOutgoing,
} from "lucide-react";
import { CallbacksTable } from "@/components/admin/diagnostic-callbacks/callbacks-table";
import {
  CallbackFilters,
  type CallbackFilterValues,
} from "@/components/admin/diagnostic-callbacks/callback-filters";
import { isCallbackStatus } from "@/lib/diagnostic-callbacks";
import type { DiagnosticCallback } from "@/types";

interface CallbackCounts {
  total: number;
  new: number;
  contacted: number;
  booked: number;
  archived: number;
}

const emptyCounts: CallbackCounts = {
  total: 0,
  new: 0,
  contacted: 0,
  booked: 0,
  archived: 0,
};

export default function DiagnosticCallbacksPage() {
  // useSearchParams needs a Suspense boundary; the inner component holds the page.
  return (
    <Suspense fallback={null}>
      <DiagnosticCallbacksView />
    </Suspense>
  );
}

function DiagnosticCallbacksView() {
  const searchParams = useSearchParams();
  // Lets the dashboard tile deep-link straight to the unworked requests.
  const initialStatus = isCallbackStatus(searchParams.get("status"))
    ? searchParams.get("status")!
    : "";

  const [callbacks, setCallbacks] = useState<DiagnosticCallback[]>([]);
  const [counts, setCounts] = useState<CallbackCounts>(emptyCounts);
  const [filters, setFilters] = useState<CallbackFilterValues>(
    initialStatus ? { status: initialStatus } : {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const response = await fetch(
        `/api/admin/diagnostic-callbacks?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setCallbacks(data.callbacks);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error("Error fetching diagnostic callbacks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/diagnostic-callbacks/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: filters.status,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to export callback requests");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diagnostic-callbacks-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export callback requests");
    }
  };

  const stats = [
    { label: "Total", value: counts.total, icon: PhoneCall, tone: "text-muted-foreground" },
    { label: "New", value: counts.new, icon: CircleDot, tone: "text-blue-600" },
    {
      label: "Contacted",
      value: counts.contacted,
      icon: PhoneOutgoing,
      tone: "text-purple-600",
    },
    {
      label: "Booked",
      value: counts.booked,
      icon: CalendarCheck,
      tone: "text-green-600",
    },
    {
      label: "Archived",
      value: counts.archived,
      icon: Archive,
      tone: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Diagnostic Callbacks</h1>
        <p className="text-muted-foreground">
          Callback requests from the /book-diagnostic page
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 bg-card rounded-lg border border-border"
            >
              <div className={`flex items-center gap-2 mb-1 ${stat.tone}`}>
                <Icon className="h-4 w-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  stat.label === "Total" ? "" : stat.tone
                }`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <CallbackFilters
        initialStatus={initialStatus}
        onFilterChange={setFilters}
        onExport={handleExport}
      />

      {/* Table */}
      <div className="bg-card rounded-lg border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <CallbacksTable callbacks={callbacks} onRefresh={fetchData} />
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import type { BlogAuthor } from "@/types";

interface AdminLayoutClientProps {
  author: BlogAuthor;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  author,
  children,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <AdminHeader
            author={author}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

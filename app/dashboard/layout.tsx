"use client";

import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-7xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
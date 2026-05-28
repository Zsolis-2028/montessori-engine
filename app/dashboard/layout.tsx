"use client";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 border-r space-y-4">
        <h2 className="text-xl font-bold mb-4">Montessori Engine</h2>

        <nav className="space-y-3">
          <a href="/dashboard/students" className="block text-blue-600">Students</a>
          <a href="/dashboard/classrooms" className="block text-blue-600">Classrooms</a>
          <a href="/dashboard/teachers" className="block text-blue-600">Teachers</a>
          <a href="/activities" className="block text-blue-600">Activities</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

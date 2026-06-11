import { ReactNode } from "react";

import { Sidebar } from "./sidebar";

import { Topbar } from "./topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

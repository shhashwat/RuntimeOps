"use client";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/lib/api/dashboard";
import { Button } from "../ui/button";
import { MobileSidebar } from "./mobile-sidebar";

export function Topbar() {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: dashboardApi.health,
    refetchInterval: 5000,
  });

  return (
    <header
      className="
    sticky
    top-0
    z-50
    bg-background
    border-b
    px-4
    py-3
    h-auto
    min-h-16
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-3
  "
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="md:hidden">
          <MobileSidebar />
        </Button>
        <h2 className="text-lg font-medium">Deployment Operations</h2>
        <h2></h2>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Badge variant="secondary">API: {health?.services?.api}</Badge>

        <Badge variant="secondary">DB: {health?.services?.database}</Badge>

        <Badge variant="secondary">Redis: {health?.services?.redis}</Badge>

        <Badge variant="secondary">
          Queue: {health?.services?.queueWorker}
        </Badge>
      </div>
    </header>
  );
}

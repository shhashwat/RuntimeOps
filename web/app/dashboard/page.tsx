"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";

import { dashboardApi } from "@/lib/api/dashboard";

export default function DashboardPage() {
  const { data: metrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: dashboardApi.metrics,
  });

  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: dashboardApi.activities,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p>Total Deployments</p>
          <h2 className="text-3xl font-bold">
            {metrics?.totalDeployments ?? 0}
          </h2>
        </Card>

        <Card className="p-4">
          <p>Successful</p>
          <h2 className="text-3xl font-bold">
            {metrics?.successfulDeployments ?? 0}
          </h2>
        </Card>

        <Card className="p-4">
          <p>Failed</p>
          <h2 className="text-3xl font-bold">
            {metrics?.failedDeployments ?? 0}
          </h2>
        </Card>

        <Card className="p-4">
          <p>Queued</p>
          <h2 className="text-3xl font-bold">
            {metrics?.queuedDeployments ?? 0}
          </h2>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>

        <div className="space-y-3">
          {activities?.slice(0, 10).map((activity: any) => (
            <div key={activity.id} className="border-b pb-2">
              <p className="text-sm">{activity.message}</p>

              <p className="text-xs text-muted-foreground">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

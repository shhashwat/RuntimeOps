"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { deploymentsApi } from "@/lib/api/deployments";

import { Card } from "@/components/ui/card";
import { StatusProgress } from "@/components/deployments/status-progress";
import { LogViewer } from "@/components/deployments/log-viewer";

export default function DeploymentDetailsPage() {
  const params = useParams();

  const deploymentId = params.id as string;

  const { data: deployment } = useQuery({
    queryKey: ["deployment", deploymentId],
    queryFn: () => deploymentsApi.getDeployment(deploymentId),
    refetchInterval: 2000,
  });

  if (!deployment) {
    return null;
  }

  const isProduction = deployment.targetEnvironment === "PRODUCTION";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deployment</h1>

        <p className="text-muted-foreground">{deployment.project.name}</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Card className="p-4">
            <StatusProgress status={deployment.status} />
          </Card>

          <div
            className={`
    flex items-center gap-2 rounded-md border px-3 py-2
    ${
      isProduction
        ? "border-green-500/20 bg-green-500/5"
        : "border-yellow-500/20 bg-yellow-500/5"
    }
  `}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isProduction ? "bg-green-500" : "bg-yellow-500"
              }`}
            />

            <span
              className={`font-mono text-xs uppercase tracking-wider ${
                isProduction ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {deployment.targetEnvironment}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="mb-4 font-semibold">Deployment Logs</h2>

        <LogViewer logs={deployment.logs} />
      </Card>
    </div>
  );
}

"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { deploymentsApi } from "@/lib/api/deployments";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeploymentsPage() {
  const { data: deployments } = useQuery({
    queryKey: ["deployments"],
    queryFn: deploymentsApi.getDeployments,
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deployments</h1>

        <p className="text-muted-foreground">Deployment history</p>
      </div>

      <div className="space-y-4">
        {deployments?.map((deployment: any) => (
          <Link
            key={deployment.id}
            href={`/dashboard/deployments/${deployment.id}`}
          >
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{deployment.project.name}</h2>

                  <p className="text-sm text-muted-foreground">
                    {deployment.id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge>{deployment.status}</Badge>

                  <Badge variant="secondary">
                    {deployment.targetEnvironment}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { projectsApi } from "@/lib/api/projects";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deploymentsApi } from "@/lib/api/deployments";
import Link from "next/link";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getProjects,
  });

  const router = useRouter();

  const triggerMutation = useMutation({
    mutationFn: deploymentsApi.triggerDeployment,

    onSuccess: (deployment) => {
      router.push(`/dashboard/deployments/${deployment.id}`);
      toast.success("Project created!");
    },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>

        <p className="text-muted-foreground mb-1">Manage deployment targets</p>

        <CreateProjectDialog />
      </div>

      <div className="grid gap-4">
        {projects?.map((project: any) => (
          <Link href={`/dashboard/projects/${project.id}`}>
            <Card key={project.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{project.name}</h2>

                  <p className="text-sm text-muted-foreground truncate md:whitespace-normal">
                    {project.repoUrl}
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    /{project.slug}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>{project.environment}</Badge>

                  <Badge variant="secondary">
                    {project.deploymentStrategy}
                  </Badge>
                </div>
              </div>

              <Button onClick={() => triggerMutation.mutate(project.id)}>
                Deploy
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

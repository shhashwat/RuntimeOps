"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { projectsApi } from "@/lib/api/projects";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { useState } from "react";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsApi.updateProject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", params.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      router.push("/dashboard/projects");
    },
  });

  const params = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params.id],
    queryFn: () => projectsApi.getProject(params.id as string),
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>

          <p className="text-muted-foreground">{project.repoUrl}</p>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => setEditOpen(true)}>Edit</Button>

            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>

              <Badge>{project.environment}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Deployment Strategy
              </p>

              <Badge variant="secondary">{project.deploymentStrategy}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Slug</p>

              <p>{project.slug}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>

              <p>{new Date(project.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
      <EditProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
        onSubmit={(data) => {
          updateMutation.mutate({
            id: project.id,
            data,
          });
        }}
      />
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        projectName={project.name}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(project.id, {
            onSuccess: () => {
              setDeleteOpen(false);
            },
          });
        }}
      />
    </>
  );
}

"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { projectsApi } from "@/lib/api/projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateProjectDialog() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const [environment, setEnvironment] = useState("STAGING");

  const [deploymentStrategy, setDeploymentStrategy] = useState("QUEUED");

  const mutation = useMutation({
    mutationFn: projectsApi.createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setName("");
      setRepoUrl("");

      setEnvironment("STAGING");
      setDeploymentStrategy("QUEUED");

      setOpen(false);
    },
  });

  function handleSubmit() {
    mutation.mutate({
      name,
      repoUrl,
      environment,
      deploymentStrategy,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />

          <select
            className="w-full border rounded-md h-10 px-3"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="STAGING">STAGING</option>

            <option value="PRODUCTION">PRODUCTION</option>
          </select>

          <select
            className="w-full border rounded-md h-10 px-3"
            value={deploymentStrategy}
            onChange={(e) => setDeploymentStrategy(e.target.value)}
          >
            <option value="QUEUED">QUEUED</option>

            <option value="MANUAL">MANUAL</option>
          </select>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

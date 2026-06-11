"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  project: {
    id: string;
    name: string;
    repoUrl: string;
    environment: string;
  };

  onSubmit: (data: {
    name: string;
    repoUrl: string;
    environment: string;
  }) => void;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
}: EditProjectDialogProps) {
  const [name, setName] = useState(project.name);

  const [repoUrl, setRepoUrl] = useState(project.repoUrl);

  const [environment, setEnvironment] = useState(project.environment);

  const handleSubmit = () => {
    onSubmit({
      name,
      repoUrl,
      environment,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
          />

          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Repository URL"
          />

          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="STAGING">STAGING</SelectItem>

              <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

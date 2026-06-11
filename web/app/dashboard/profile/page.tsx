"use client";

import { useState, useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
  });

  const [profileOpen, setProfileOpen] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);

  const [name, setName] = useState("");

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: authApi.updateProfile,

    onSuccess: () => {
      setProfileOpen(false);
      setPasswordOpen(false);
      setPassword("");
    },
  });

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>

          <p className="text-muted-foreground">
            Manage your RuntimeOps account
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>

              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>

              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Role</p>

              <Badge>{user.role}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Joined</p>

              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setProfileOpen(true)}>Edit Profile</Button>

              <Button variant="outline" onClick={() => setPasswordOpen(true)}>
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>

            <DialogDescription>
              Update your account information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <Button
              className="w-full"
              disabled={updateMutation.isPending}
              onClick={() =>
                updateMutation.mutate({
                  name,
                })
              }
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>

            <DialogDescription>
              Enter a new password for your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              className="w-full"
              disabled={updateMutation.isPending}
              onClick={() =>
                updateMutation.mutate({
                  password,
                })
              }
            >
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

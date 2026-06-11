"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { tokenStorage } from "@/lib/auth/token";
import { authApi } from "@/lib/api/auth";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    }
    tokenStorage.clear();

    router.push("/login");
  }

  return (
    <Button variant="destructive" className="w-full" onClick={logout}>
      Logout
    </Button>
  );
}

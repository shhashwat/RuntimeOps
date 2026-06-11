"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Activity,
  FolderKanban,
  LayoutDashboard,
  Rocket,
  User,
} from "lucide-react";

import { List } from "@phosphor-icons/react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../auth/logout-button";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Deployments",
    href: "/dashboard/deployments",
    icon: Rocket,
  },
  {
    label: "Activities",
    href: "/dashboard/activities",
    icon: Activity,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <List size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-lg font-semibold">RuntimeOps</h1>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-3
                  rounded-lg px-3 py-2
                  text-sm text-muted-foreground
                  hover:bg-muted hover:text-foreground
                  transition-colors
                "
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}

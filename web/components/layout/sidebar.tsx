"use client";

import Link from "next/link";

import {
  Activity,
  FolderKanban,
  LayoutDashboard,
  Rocket,
  User,
} from "lucide-react";
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

export function Sidebar() {
  return (
    <aside
      className="hidden md:flex h-screen  sticky
    top-0
    h-screen
    w-64
    border-r
    shrink-0 border-border bg-background flex-col"
    >
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-lg font-semibold">RuntimeOps</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
    </aside>
  );
}

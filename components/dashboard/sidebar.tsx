"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart2,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: KanbanSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userEmail: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-surface border-r-4 border-black min-h-screen shrink-0">
      {/* Logo */}
      <div className="p-6 border-b-4 border-black">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span
            className="text-primary text-xs leading-tight"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            KICKSTART
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all border-2",
                active
                  ? "bg-primary text-white border-black shadow-[2px_2px_0px_#000]"
                  : "text-white/60 border-transparent hover:bg-white/5 hover:text-white hover:border-black hover:shadow-[2px_2px_0px_#000]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t-4 border-black space-y-2">
        <p className="text-white/40 text-xs truncate px-1">{userEmail}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-white/60 border-2 border-transparent transition-all hover:bg-white/5 hover:text-white hover:border-black hover:shadow-[2px_2px_0px_#000]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}

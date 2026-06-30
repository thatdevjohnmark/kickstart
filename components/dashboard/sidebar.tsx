"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart2,
  Calendar,
  Settings,
  LogOut,
  Zap,
  PanelLeftClose,
  PanelLeft,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: KanbanSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/ats", label: "ATS Check", icon: FileSearch },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userEmail: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-surface border-r-4 border-black min-h-screen shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Zap className="w-5 h-5 text-primary shrink-0" />
            {!collapsed && (
              <span
                className="text-primary text-xs leading-tight whitespace-nowrap"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                KICKSTART
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all border-2",
                  collapsed ? "justify-center px-0" : "",
                  active
                    ? "bg-primary text-white border-black shadow-[2px_2px_0px_#000]"
                    : "text-white/60 border-transparent hover:bg-white/5 hover:text-white hover:border-black hover:shadow-[2px_2px_0px_#000]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t-4 border-black space-y-2">
          {!collapsed && (
            <p className="text-white/40 text-xs truncate px-1">{userEmail}</p>
          )}
          <form action={logout}>
            <button
              type="submit"
              title={collapsed ? "Log Out" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium border-2 border-transparent transition-all",
                collapsed ? "justify-center px-0" : "",
                "text-white/60 hover:bg-white/5 hover:text-white hover:border-black hover:shadow-[2px_2px_0px_#000]"
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Log Out</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav — only on small screens */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden bg-surface border-t-4 border-black justify-around px-2 py-2 safe-area-bottom">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors min-w-0",
                active
                  ? "text-primary"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight truncate max-w-full">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

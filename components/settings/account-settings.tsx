"use client";

import { User, Mail } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface AccountSettingsProps {
  email: string;
}

export function AccountSettings({ email }: AccountSettingsProps) {
  return (
    <section>
      <SectionHeader icon={User} title="Account" />

      <div className="retro-card bg-surface p-6 space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-background border-2 border-white/10">
          <Mail className="w-4 h-4 text-white/40 shrink-0" />
          <div>
            <p className="text-white/40 text-xs mb-0.5">Email</p>
            <p className="text-white text-sm">{email}</p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className={cn(
              "w-full py-2.5 rounded-md border-2 border-black text-sm font-medium",
              "bg-rejected text-white shadow-[3px_3px_0px_#000]",
              "hover:bg-rejected/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            )}
          >
            Sign Out
          </button>
        </form>
      </div>
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-primary" />
      <h2
        className="text-white text-xs"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        {title}
      </h2>
    </div>
  );
}

import { TrendingUp, Activity, MessageSquare, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types/application";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}

function StatCard({ label, value, icon: Icon, color, suffix }: StatCardProps) {
  return (
    <div className="retro-card bg-surface p-5 flex items-center gap-4">
      <div className={cn("p-2.5 rounded-md border-2 border-black", color)}>
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div>
        <p className="text-white/50 text-xs mb-1">{label}</p>
        <p className="text-white text-2xl font-bold leading-none">
          {value}
          {suffix && (
            <span className="text-white/50 text-sm font-normal ml-1">{suffix}</span>
          )}
        </p>
      </div>
    </div>
  );
}

interface StatsBarProps {
  stats: DashboardStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Total"
        value={stats.total}
        icon={TrendingUp}
        color="bg-primary"
      />
      <StatCard
        label="Active"
        value={stats.active}
        icon={Activity}
        color="bg-applied"
      />
      <StatCard
        label="Response Rate"
        value={stats.responseRate}
        suffix="%"
        icon={MessageSquare}
        color="bg-assessment"
      />
      <StatCard
        label="Interviews"
        value={stats.interviews}
        icon={Users}
        color="bg-interviewing"
      />
      <StatCard
        label="Offers"
        value={stats.offers}
        icon={Trophy}
        color="bg-offer"
      />
    </div>
  );
}

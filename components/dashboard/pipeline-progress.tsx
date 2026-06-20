import { cn } from "@/lib/utils";
import type { DashboardStats, Stage } from "@/types/application";

const STAGE_CONFIG: Record<Stage, { label: string; colorClass: string; bgClass: string }> = {
  saved: { label: "Saved", colorClass: "bg-saved", bgClass: "bg-saved/10" },
  applied: { label: "Applied", colorClass: "bg-applied", bgClass: "bg-applied/10" },
  assessment: { label: "Assessment", colorClass: "bg-assessment", bgClass: "bg-assessment/10" },
  interviewing: { label: "Interviewing", colorClass: "bg-interviewing", bgClass: "bg-interviewing/10" },
  offer: { label: "Offer", colorClass: "bg-offer", bgClass: "bg-offer/10" },
  rejected: { label: "Rejected", colorClass: "bg-rejected", bgClass: "bg-rejected/10" },
  ghosted: { label: "Ghosted", colorClass: "bg-ghosted", bgClass: "bg-ghosted/10" },
};

const STAGE_ORDER: Stage[] = [
  "saved",
  "applied",
  "assessment",
  "interviewing",
  "offer",
  "rejected",
  "ghosted",
];

interface PipelineProgressProps {
  stats: DashboardStats;
}

export function PipelineProgress({ stats }: PipelineProgressProps) {
  const total = stats.total || 1; // avoid divide-by-zero

  return (
    <div className="retro-card bg-surface p-6">
      <h2 className="text-white text-xs mb-6" style={{ fontFamily: "'Press Start 2P', cursive" }}>
        Pipeline
      </h2>

      {/* Stacked bar */}
      <div className="flex h-4 rounded overflow-hidden border-2 border-black mb-6 gap-px bg-black">
        {STAGE_ORDER.map((stage) => {
          const count = stats.stageCounts.find((s) => s.stage === stage)?.count ?? 0;
          const pct = (count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={stage}
              className={cn(STAGE_CONFIG[stage].colorClass, "transition-all")}
              style={{ width: `${pct}%` }}
              title={`${STAGE_CONFIG[stage].label}: ${count}`}
            />
          );
        })}
      </div>

      {/* Stage rows */}
      <div className="space-y-3">
        {STAGE_ORDER.map((stage) => {
          const count = stats.stageCounts.find((s) => s.stage === stage)?.count ?? 0;
          const pct = total > 1 ? Math.round((count / stats.total) * 100) : 0;
          const config = STAGE_CONFIG[stage];

          return (
            <div key={stage} className="flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-sm border border-black shrink-0", config.colorClass)} />
              <span className="text-white/60 text-xs w-24 shrink-0">{config.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", config.colorClass)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-white/50 text-xs w-6 text-right shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

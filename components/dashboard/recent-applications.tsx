import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Application, Stage } from "@/types/application";
import { ExternalLink } from "lucide-react";

const STAGE_COLORS: Record<Stage, string> = {
  saved: "bg-saved/20 text-saved border-saved/40",
  applied: "bg-applied/20 text-applied border-applied/40",
  assessment: "bg-assessment/20 text-assessment border-assessment/40",
  interviewing: "bg-interviewing/20 text-interviewing border-interviewing/40",
  offer: "bg-offer/20 text-offer border-offer/40",
  rejected: "bg-rejected/20 text-rejected border-rejected/40",
  ghosted: "bg-ghosted/20 text-ghosted border-ghosted/40",
};

const STAGE_LABELS: Record<Stage, string> = {
  saved: "Saved",
  applied: "Applied",
  assessment: "Assessment",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

interface RecentApplicationsProps {
  applications: Application[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const recent = applications.slice(0, 8);

  return (
    <div className="retro-card bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Recent
        </h2>
        <Link
          href="/applications"
          className="text-primary text-xs hover:underline"
        >
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-white/30 text-sm">No applications yet.</p>
          <Link
            href="/applications"
            className="text-primary text-xs mt-2 inline-block hover:underline"
          >
            Add your first application →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border-2 border-transparent hover:border-black hover:bg-white/5 transition-all group"
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {app.company}
                </p>
                <p className="text-white/50 text-xs truncate">{app.role}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white/40 hover:text-white" />
                  </a>
                )}
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border font-medium capitalize",
                    STAGE_COLORS[app.stage]
                  )}
                >
                  {STAGE_LABELS[app.stage]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ResumeCheck } from "@/lib/actions/resume-checks";

interface AtsHistoryProps {
  checks: ResumeCheck[];
}

function MiniBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

function Sparkline({ scores }: { scores: number[] }) {
  if (scores.length < 2) return null;
  const max = Math.max(...scores, 100);
  const points = scores.map((s, i) => {
    const x = ((i / (scores.length - 1)) * 36);
    const y = 12 - ((s / max) * 10);
    return `${x},${y}`;
  });
  const polyline = points.join(" ");
  const color = scores[0] >= scores[scores.length - 1] ? "#f87171" : "#34d399";
  return (
    <svg width="36" height="14" className="shrink-0" viewBox="0 0 36 14">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polyline}
      />
    </svg>
  );
}

export function AtsHistory({ checks }: AtsHistoryProps) {
  // ponytail: depends on getResumeChecks returning created_at desc.
  // reverse() makes oldest-first for the sparkline; diff-indicator uses the original desc order.
  const scores = checks.map((c) => c.score).reverse();

  if (!checks.length) {
    return (
      <div className="text-center py-8 text-white/40 text-xs">
        <FileText className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p>No checks yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
          Check History
        </h3>
        <Sparkline scores={scores} />
      </div>
      <div className="space-y-1">
        {checks.map((check, i) => {
          const prevScore = checks[i + 1]?.score;
          const diff = prevScore !== undefined ? check.score - prevScore : null;

          return (
            <div
              key={check.id}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded"
            >
              <FileText className="w-3 h-3 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 truncate leading-tight">
                  {check.filename.replace(/\.[^.]+$/, "")}
                </p>
                <p className="text-[10px] text-white/30">
                  {new Date(check.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <MiniBar score={check.score} />
              <span
                className={`text-xs font-mono font-bold ${
                  check.score >= 80
                    ? "text-green-400"
                    : check.score >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {check.score}
              </span>
              {diff !== null && diff !== 0 && (
                <span className={`flex items-center text-[10px] ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
                  {diff > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {Math.abs(diff)}
                </span>
              )}
              {diff === 0 && <Minus className="w-2.5 h-2.5 text-white/20" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

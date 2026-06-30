"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Lightbulb } from "lucide-react";
import type { AtsResult, AtsCheck } from "@/lib/ats/engine";

interface AtsResultsProps {
  result: AtsResult;
}

function CategoryScoreBar({ score }: { score: number }) {
  const bg =
    score >= 80 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${score}%` }} />
    </div>
  );
}

function CategoryCard({ check }: { check: AtsCheck }) {
  const [open, setOpen] = useState(false);
  const hasFailing = check.items.some((i) => !i.passed);
  const badgeColor =
    check.score >= 80
      ? "text-green-400"
      : check.score >= 50
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="rounded-md bg-white/[0.03] border border-white/10">
      {/* Summary row — always visible */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        <span className="text-xs shrink-0">{open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}</span>
        <span className="text-xs text-white/70 min-w-0 flex-1">{check.name}</span>
        <div className="flex-1 max-w-24 ml-auto">
          <CategoryScoreBar score={check.score} />
        </div>
        <span className={`text-xs font-mono font-bold shrink-0 ${badgeColor}`}>
          {check.score}
        </span>
        {hasFailing && <span className="text-[10px] text-yellow-400 shrink-0">⚠</span>}
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-3 pb-2 pt-0 space-y-0.5 border-t border-white/5">
          {check.items.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] pl-6 pt-1.5">
              <span className={item.passed ? "text-green-400 shrink-0" : "text-red-400 shrink-0"}>
                {item.passed ? "●" : "○"}
              </span>
              <span className={item.passed ? "text-white/50" : "text-white/40"}>
                {item.label}
                <span className="text-white/25 ml-1">— {item.details}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AtsResults({ result }: AtsResultsProps) {
  const scoreColor =
    result.score >= 80 ? "text-green-400" : result.score >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreBarColor =
    result.score >= 80 ? "bg-green-400" : result.score >= 50 ? "bg-yellow-400" : "bg-red-400";

  const label =
    result.score >= 80
      ? "Great — your resume is well-optimized"
      : result.score >= 50
        ? "Decent — a few improvements will help"
        : "Needs work — see recommendations below";

  return (
    <div className="space-y-5 pt-5">
      {/* Overall Score — high score style */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-0">
          <span
            className={`text-6xl font-bold ${scoreColor}`}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {result.score}
          </span>
          <span className="text-lg text-white/20 ml-1" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            /100
          </span>
        </div>
        <p className="text-xs text-white/50 mt-2">{label}</p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-black mt-3 mx-auto max-w-sm">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Category breakdown — collapsible per card */}
      <div className="space-y-1">
        <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest px-1">
          Breakdown — click to expand
        </h4>
        {result.checks.map((check, i) => (
          <CategoryCard key={i} check={check} />
        ))}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-yellow-400" />
            <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
              Top Improvements
            </h4>
          </div>
          <ul className="space-y-1">
            {result.recommendations.slice(0, 3).map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                <span className="text-primary shrink-0 mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing keywords */}
      {result.missingKeywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
              Missing Keywords
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {result.missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 text-[11px] bg-red-400/10 text-red-400 border border-red-400/20 rounded"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { AnalyticsData, MonthlyData, StageDistribution } from "@/types/analytics";
import type { Stage } from "@/types/application";

const STAGE_COLORS: Record<Stage, string> = {
  saved: "#94a3b8",
  applied: "#60a5fa",
  assessment: "#fbbf24",
  interviewing: "#fb923c",
  offer: "#34d399",
  rejected: "#f87171",
  ghosted: "#71717a",
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();

  // Fetch all applications with resume info
  const { data: apps, error } = await supabase
    .from("applications")
    .select("stage, date_applied, created_at, resume_id")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Fetch resumes for performance tracking
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, name");

  const resumeMap = new Map<string, string>(
    (resumes ?? []).map((r: { id: string; name: string }) => [r.id, r.name])
  );

  // ── Monthly data: last 6 months ──────────────────────────────────────────
  const monthly: MonthlyData[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const label = format(date, "MMM");

    const inRange = apps.filter((a) => {
      const d = new Date(a.date_applied ?? a.created_at);
      return d >= start && d <= end;
    });

    monthly.push({
      month: label,
      applications: inRange.length,
      interviews: inRange.filter((a) => a.stage === "interviewing").length,
      offers: inRange.filter((a) => a.stage === "offer").length,
    });
  }

  // ── Stage distribution ───────────────────────────────────────────────────
  const stageCounts: Record<string, number> = {};
  for (const a of apps) {
    stageCounts[a.stage] = (stageCounts[a.stage] ?? 0) + 1;
  }

  const stageDistribution: StageDistribution[] = Object.entries(stageCounts).map(
    ([stage, count]) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count,
      color: STAGE_COLORS[stage as Stage] ?? "#71717a",
    })
  );

  // ── Summary metrics ──────────────────────────────────────────────────────
  const totalApplications = apps.length;
  const totalInterviews = apps.filter((a) => a.stage === "interviewing").length;
  const totalOffers = apps.filter((a) => a.stage === "offer").length;
  const applied = apps.filter((a) => a.stage !== "saved").length;
  const responseEligible = apps.filter((a) =>
    ["interviewing", "offer"].includes(a.stage)
  ).length;
  const responseRate =
    applied > 0 ? Math.round((responseEligible / applied) * 100) : 0;

  // ── Resume performance ───────────────────────────────────────────────────
  const resumeStats = new Map<
    string,
    { applications: number; interviews: number; offers: number }
  >();

  for (const a of apps) {
    if (!a.resume_id) continue;
    const existing = resumeStats.get(a.resume_id) ?? {
      applications: 0,
      interviews: 0,
      offers: 0,
    };
    existing.applications++;
    if (a.stage === "interviewing") existing.interviews++;
    if (a.stage === "offer") existing.offers++;
    resumeStats.set(a.resume_id, existing);
  }

  const resumePerformance = Array.from(resumeStats.entries()).map(
    ([resume_id, s]) => ({
      resume_id,
      resume_name: resumeMap.get(resume_id) ?? "Unknown Resume",
      ...s,
      interview_rate:
        s.applications > 0
          ? Math.round((s.interviews / s.applications) * 100)
          : 0,
      offer_rate:
        s.applications > 0
          ? Math.round((s.offers / s.applications) * 100)
          : 0,
    })
  );

  return {
    monthly,
    stageDistribution,
    responseRate,
    totalApplications,
    totalInterviews,
    totalOffers,
    resumePerformance,
  };
}

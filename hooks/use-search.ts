"use client";

import { useState, useMemo } from "react";
import type { Application, Stage } from "@/types/application";

export function useSearch(applications: Application[]) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return applications.filter((app) => {
      const matchesQuery =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        (app.location ?? "").toLowerCase().includes(q);

      const matchesStage =
        stageFilter === "all" || app.stage === stageFilter;

      return matchesQuery && matchesStage;
    });
  }, [applications, query, stageFilter]);

  return { query, setQuery, stageFilter, setStageFilter, filtered };
}

"use client";

import { useState, useRef } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import type { Application, Stage } from "@/types/application";
import { STAGES } from "@/types/application";

export function useBoard(
  applications: Application[],
  onMove: (id: string, stage: Stage) => void
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Track the target stage during an active drag to avoid duplicate moves
  const lastDragTarget = useRef<{ id: string; stage: Stage } | null>(null);

  const activeApp = applications.find((a) => a.id === activeId) ?? null;

  function byStage(stage: Stage) {
    return applications.filter((a) => a.stage === stage);
  }

  function resolveTargetStage(
    active: { id: unknown },
    over: { id: unknown }
  ): Stage | null {
    const overId = over.id as string;

    // Dropped on a column header
    if ((STAGES as readonly string[]).includes(overId)) {
      return overId as Stage;
    }

    // Dropped on another card — use that card's stage
    const targetApp = applications.find((a) => a.id === overId);
    if (targetApp) return targetApp.stage;

    return null;
  }

  function shouldMove(activeId: string, targetStage: Stage): boolean {
    const app = applications.find((a) => a.id === activeId);
    if (!app || app.stage === targetStage) return false;

    // Skip if we already sent this exact move during this drag session
    const last = lastDragTarget.current;
    if (last?.id === activeId && last?.stage === targetStage) return false;

    return true;
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
    lastDragTarget.current = null;
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const targetStage = resolveTargetStage(active, over);
    if (!targetStage) return;

    if (shouldMove(active.id as string, targetStage)) {
      lastDragTarget.current = { id: active.id as string, stage: targetStage };
      onMove(active.id as string, targetStage);
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    lastDragTarget.current = null;

    if (!over) return;
    const targetStage = resolveTargetStage(active, over);
    if (!targetStage) return;

    const app = applications.find((a) => a.id === active.id);
    if (app && app.stage !== targetStage) {
      onMove(active.id as string, targetStage);
    }
  }

  return {
    activeId,
    activeApp,
    byStage,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}

"use client";

import { useState } from "react";
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

  const activeApp = applications.find((a) => a.id === activeId) ?? null;

  function byStage(stage: Stage) {
    return applications.filter((a) => a.stage === stage);
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const overId = over.id as string;

    // Dragging over a column header
    if ((STAGES as readonly string[]).includes(overId)) {
      const targetStage = overId as Stage;
      const app = applications.find((a) => a.id === active.id);
      if (app && app.stage !== targetStage) {
        onMove(app.id, targetStage);
      }
      return;
    }

    // Dragging over another card — move to that card's stage
    const targetApp = applications.find((a) => a.id === overId);
    const sourceApp = applications.find((a) => a.id === active.id);
    if (
      targetApp &&
      sourceApp &&
      targetApp.stage !== sourceApp.stage
    ) {
      onMove(sourceApp.id, targetApp.stage);
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const overId = over.id as string;

    if ((STAGES as readonly string[]).includes(overId)) {
      const app = applications.find((a) => a.id === active.id);
      if (app) onMove(app.id, overId as Stage);
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

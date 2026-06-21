"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { ApplicationCard } from "./application-card";
import { AddCard } from "./add-card";
import type { Application, Stage } from "@/types/application";

const STAGE_COLORS: Record<Stage, string> = {
  saved: "border-saved text-saved",
  applied: "border-applied text-applied",
  assessment: "border-assessment text-assessment",
  interviewing: "border-interviewing text-interviewing",
  offer: "border-offer text-offer",
  rejected: "border-rejected text-rejected",
  ghosted: "border-ghosted text-ghosted",
};

const STAGE_DOT: Record<Stage, string> = {
  saved: "bg-saved",
  applied: "bg-applied",
  assessment: "bg-assessment",
  interviewing: "bg-interviewing",
  offer: "bg-offer",
  rejected: "bg-rejected",
  ghosted: "bg-ghosted",
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

interface ColumnProps {
  stage: Stage;
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onAdd: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  resumeMap: Record<string, string>;
}

export function Column({ stage, applications, onEdit, onDelete, onAdd, resumeMap }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 mb-3",
          "border-b-2",
          STAGE_COLORS[stage]
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-sm border border-black", STAGE_DOT[stage])} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {STAGE_LABELS[stage]}
          </span>
        </div>
        <span className="text-white/30 text-xs font-mono">{applications.length}</span>
      </div>

      {/* Cards drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 min-h-[100px] rounded-lg p-1 transition-colors",
          isOver && "bg-white/5 ring-2 ring-primary/30"
        )}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
              resumeMap={resumeMap}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      <div className="mt-2">
        <AddCard stage={stage} onAdd={onAdd} />
      </div>
    </div>
  );
}

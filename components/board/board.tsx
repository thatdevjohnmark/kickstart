"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { STAGES, type Application, type Stage } from "@/types/application";
import type { Resume } from "@/types/resume";
import { useApplications } from "@/hooks/use-applications";
import { useBoard } from "@/hooks/use-board";
import { useSearch } from "@/hooks/use-search";
import { Column } from "./column";
import { ApplicationCard } from "./application-card";
import { ApplicationModal } from "@/components/dialogs/application-modal";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { cn } from "@/lib/utils";

interface BoardProps {
  initialApplications: Application[];
  resumes?: Resume[];
}

export function Board({ initialApplications, resumes = [] }: BoardProps) {
  const {
    applications,
    moveApplication,
    addApplication,
    editApplication,
    removeApplication,
    error,
  } = useApplications(initialApplications);

  const { query, setQuery, stageFilter, setStageFilter, filtered } = useSearch(applications);

  const { activeApp, byStage, handleDragStart, handleDragOver, handleDragEnd } =
    useBoard(filtered, moveApplication);

  // Build a lookup map: resume_id → resume name
  const resumeMap = Object.fromEntries(
    resumes.map((r) => [r.id, r.name])
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);

  function openAdd() {
    setEditingApp(null);
    setModalOpen(true);
  }

  function openEdit(app: Application) {
    setEditingApp(app);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingApp(null);
  }

  async function handleModalSubmit(formData: FormData) {
    if (editingApp) {
      return editApplication(editingApp.id, formData);
    }
    return addApplication(formData);
  }

  async function handleDeleteConfirm() {
    if (deletingApp) await removeApplication(deletingApp.id);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b-4 border-black bg-surface shrink-0">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search applications…"
          className="flex-1 max-w-xs bg-background border-2 border-black rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary transition-colors"
        />
        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage | "all")}
          className="bg-background border-2 border-black rounded-md px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="all">All Stages</option>
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="assessment">Assessment</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="ghosted">Ghosted</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          {error && (
            <p className="text-rejected text-xs">{error}</p>
          )}
          <button
            onClick={openAdd}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
              "border-2 border-black bg-primary text-white",
              "shadow-[3px_3px_0px_#000] hover:bg-primary/90",
              "active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            )}
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-5 p-6 h-full min-w-max">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {STAGES.map((stage) => (
              <Column
                key={stage}
                stage={stage as Stage}
                applications={byStage(stage as Stage)}
                onEdit={openEdit}
                onDelete={(app) => setDeletingApp(app)}
                onAdd={addApplication}
                resumeMap={resumeMap}
              />
            ))}

            <DragOverlay>
              {activeApp ? (
                <ApplicationCard
                  application={activeApp}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isDragOverlay
                  resumeMap={resumeMap}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <ApplicationModal
          application={editingApp}
          resumes={resumes}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}

      {deletingApp && (
        <DeleteDialog
          title={`Delete ${deletingApp.company}?`}
          description={`This will permanently remove "${deletingApp.role}" at ${deletingApp.company}. This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingApp(null)}
        />
      )}
    </div>
  );
}

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
import { Plus } from "lucide-react";
import { STAGES, type Application, type Stage } from "@/types/application";
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
}

export function Board({ initialApplications }: BoardProps) {
  const {
    applications,
    moveApplication,
    addApplication,
    editApplication,
    removeApplication,
    error,
  } = useApplications(initialApplications);

  const { query, setQuery, filtered } = useSearch(applications);

  const { activeApp, byStage, handleDragStart, handleDragOver, handleDragEnd } =
    useBoard(filtered, moveApplication);

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
              />
            ))}

            <DragOverlay>
              {activeApp ? (
                <ApplicationCard
                  application={activeApp}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isDragOverlay
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

"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createResume, updateResume, deleteResume } from "@/lib/actions/resumes";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import type { Resume } from "@/types/resume";
import { format } from "date-fns";

interface ResumeManagerProps {
  initialResumes: Resume[];
}

export function ResumeManager({ initialResumes }: ResumeManagerProps) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingResume, setDeletingResume] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createResume(fd);
    if (result.error) {
      setError(result.error);
    } else {
      // Optimistically reload by refreshing — server action revalidates
      setAdding(false);
      window.location.reload();
    }
  }

  async function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await updateResume(id, fd);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
      window.location.reload();
    }
  }

  async function handleDelete() {
    if (!deletingResume) return;
    await deleteResume(deletingResume.id);
    setResumes((prev) => prev.filter((r) => r.id !== deletingResume.id));
    setDeletingResume(null);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h2
            className="text-white text-xs"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Resumes
          </h2>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-black text-xs font-medium bg-primary text-white shadow-[2px_2px_0px_#000] hover:bg-primary/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Resume
          </button>
        )}
      </div>

      <div className="retro-card bg-surface p-6 space-y-3">
        {error && (
          <p className="text-rejected text-xs border border-rejected/40 bg-rejected/10 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* Add form */}
        {adding && (
          <ResumeForm
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
          />
        )}

        {/* Resume list */}
        {resumes.length === 0 && !adding ? (
          <div className="py-8 text-center">
            <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/30 text-sm">No resumes yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) =>
              editingId === resume.id ? (
                <ResumeForm
                  key={resume.id}
                  resume={resume}
                  onSubmit={(e) => handleUpdate(resume.id, e)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={resume.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border-2 border-white/10 hover:border-white/20 group transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {resume.name}
                    </p>
                    {resume.description && (
                      <p className="text-white/40 text-xs truncate mt-0.5">
                        {resume.description}
                      </p>
                    )}
                    <p className="text-white/20 text-xs mt-0.5">
                      Added {format(new Date(resume.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(resume.id)}
                      className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingResume(resume)}
                      className="p-1.5 rounded hover:bg-rejected/20 text-white/40 hover:text-rejected transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {deletingResume && (
        <DeleteDialog
          title={`Delete "${deletingResume.name}"?`}
          description="This resume will be unlinked from any applications. This action cannot be undone."
          onConfirm={handleDelete}
          onClose={() => setDeletingResume(null)}
        />
      )}
    </section>
  );
}

function ResumeForm({
  resume,
  onSubmit,
  onCancel,
}: {
  resume?: Resume;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    setSubmitting(true);
    await onSubmit(e);
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handle}
      className="p-4 rounded-lg bg-background border-2 border-primary space-y-3"
    >
      <input
        name="name"
        defaultValue={resume?.name ?? ""}
        required
        placeholder="Resume name (e.g. Senior Engineer v2)"
        className={inputCls}
        autoFocus
      />
      <input
        name="description"
        defaultValue={resume?.description ?? ""}
        placeholder="Short description (optional)"
        className={inputCls}
      />
      <input
        name="file_url"
        type="url"
        defaultValue={resume?.file_url ?? ""}
        placeholder="File URL (optional)"
        className={inputCls}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-black text-xs font-medium",
            "bg-primary text-white shadow-[2px_2px_0px_#000]",
            "hover:bg-primary/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all",
            "disabled:opacity-50"
          )}
        >
          <Check className="w-3.5 h-3.5" />
          {submitting ? "Saving…" : resume ? "Save" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-surface border-2 border-black rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors";

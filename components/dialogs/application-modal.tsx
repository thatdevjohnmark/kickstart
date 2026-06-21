"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES, type Application, type Stage } from "@/types/application";
import type { Resume } from "@/types/resume";

const STAGE_LABELS: Record<Stage, string> = {
  saved: "Saved",
  applied: "Applied",
  assessment: "Assessment",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

interface ApplicationModalProps {
  application?: Application | null;
  defaultStage?: Stage;
  resumes?: Resume[];
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onClose: () => void;
}

export function ApplicationModal({
  application,
  defaultStage = "saved",
  resumes = [],
  onSubmit,
  onClose,
}: ApplicationModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await onSubmit(fd);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  const isEdit = !!application;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg bg-surface border-4 border-black rounded-xl shadow-[6px_6px_0px_#000] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black">
          <h2 className="text-white text-xs" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {isEdit ? "Edit Application" : "New Application"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company *" required>
              <input
                name="company"
                defaultValue={application?.company ?? ""}
                required
                placeholder="Acme Corp"
                className={inputCls}
              />
            </Field>
            <Field label="Role *" required>
              <input
                name="role"
                defaultValue={application?.role ?? ""}
                required
                placeholder="Senior Engineer"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Stage">
              <select
                name="stage"
                defaultValue={application?.stage ?? defaultStage}
                className={cn(inputCls, "cursor-pointer")}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date Applied">
              <input
                name="date_applied"
                type="date"
                defaultValue={application?.date_applied ?? ""}
                className={cn(inputCls, "cursor-pointer")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Reminder">
              <input
                name="reminder_date"
                type="date"
                defaultValue={application?.reminder_date ?? ""}
                className={cn(inputCls, "cursor-pointer")}
              />
            </Field>
            <Field label="Resume">
              <select
                name="resume_id"
                defaultValue={application?.resume_id ?? ""}
                className={cn(inputCls, "cursor-pointer")}
              >
                <option value="">None</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input
                name="location"
                defaultValue={application?.location ?? ""}
                placeholder="Remote, NYC…"
                className={inputCls}
              />
            </Field>
            <Field label="Salary">
              <input
                name="salary"
                defaultValue={application?.salary ?? ""}
                placeholder="$120k–$150k"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Job URL">
            <input
              name="job_url"
              type="url"
              defaultValue={application?.job_url ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="Notes">
            <textarea
              name="notes"
              defaultValue={application?.notes ?? ""}
              placeholder="Any notes about the role…"
              rows={3}
              className={cn(inputCls, "resize-none")}
            />
          </Field>

          {error && (
            <p className="text-rejected text-xs border border-rejected/40 bg-rejected/10 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-md border-2 border-black text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "flex-1 py-2 rounded-md border-2 border-black text-sm font-medium",
                "bg-primary text-white shadow-[3px_3px_0px_#000]",
                "hover:bg-primary/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              )}
            >
              {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-white/50 text-xs">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-background border-2 border-black rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors";

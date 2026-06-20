"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stage } from "@/types/application";

interface AddCardProps {
  stage: Stage;
  onAdd: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export function AddCard({ stage, onAdd }: AddCardProps) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.set("company", company.trim());
    fd.set("role", role.trim());
    fd.set("stage", stage);

    const result = await onAdd(fd);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setCompany("");
      setRole("");
      setOpen(false);
    }
  }

  function handleCancel() {
    setOpen(false);
    setCompany("");
    setRole("");
    setError(null);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm",
          "text-white/30 hover:text-white/60 hover:bg-white/5",
          "border-2 border-dashed border-white/10 hover:border-white/20",
          "transition-all"
        )}
      >
        <Plus className="w-4 h-4" />
        Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border-2 border-primary rounded-lg p-3 shadow-[3px_3px_0px_#000] space-y-2"
    >
      <input
        autoFocus
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        className="w-full bg-transparent text-white text-sm placeholder:text-white/30 border-b border-white/20 pb-1 outline-none"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        className="w-full bg-transparent text-white/70 text-xs placeholder:text-white/20 outline-none"
      />
      {error && <p className="text-rejected text-xs">{error}</p>}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting || !company.trim() || !role.trim()}
          className={cn(
            "px-3 py-1 rounded text-xs font-medium border-2 border-black",
            "bg-primary text-white shadow-[2px_2px_0px_#000]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "hover:bg-primary/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          )}
        >
          {submitting ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

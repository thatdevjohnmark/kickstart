"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function DeleteDialog({
  title,
  description,
  onConfirm,
  onClose,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-sm bg-surface border-4 border-black rounded-xl shadow-[6px_6px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-black">
          <div className="flex items-center gap-2 text-rejected">
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-semibold" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Delete
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <div>
            <p className="text-white font-semibold text-sm">{title}</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">{description}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 rounded-md border-2 border-black text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 py-2 rounded-md border-2 border-black text-sm font-medium",
                "bg-rejected text-white shadow-[3px_3px_0px_#000]",
                "hover:bg-rejected/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              )}
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

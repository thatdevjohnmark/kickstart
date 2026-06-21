"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, DollarSign, Calendar, ExternalLink, Pencil, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/application";
import { format } from "date-fns";

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  isDragOverlay?: boolean;
  resumeMap?: Record<string, string>;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  isDragOverlay = false,
  resumeMap = {},
}: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-background border-2 border-black rounded-lg p-3 cursor-grab active:cursor-grabbing",
        "shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5",
        "transition-all select-none group",
        isDragging && "opacity-40",
        isDragOverlay && "shadow-[5px_5px_0px_#000] rotate-2 cursor-grabbing"
      )}
    >
      {/* Company + role */}
      <div className="mb-2">
        <p className="text-white font-semibold text-sm leading-tight truncate">
          {application.company}
        </p>
        <p className="text-white/50 text-xs truncate mt-0.5">{application.role}</p>
      </div>

      {/* Meta */}
      <div className="space-y-1">
        {application.location && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}
        {application.salary && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <DollarSign className="w-3 h-3 shrink-0" />
            <span className="truncate">{application.salary}</span>
          </div>
        )}
        {application.date_applied && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{format(new Date(application.date_applied), "MMM d, yyyy")}</span>
          </div>
        )}
        {application.resume_id && resumeMap?.[application.resume_id] && (
          <div className="flex items-center gap-1.5 text-primary/60 text-xs">
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">{resumeMap[application.resume_id]}</span>
          </div>
        )}
      </div>

      {/* Actions — shown on hover, stop drag propagation */}
      <div
        className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {application.job_url && (
          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            title="Open job posting"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={() => onEdit(application)}
          className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(application)}
          className="p-1 rounded hover:bg-rejected/20 text-white/40 hover:text-rejected transition-colors ml-auto"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

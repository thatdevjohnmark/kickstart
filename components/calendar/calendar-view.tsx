"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Bell, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Application, Stage } from "@/types/application";

const STAGE_COLORS: Record<Stage, string> = {
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

interface CalendarViewProps {
  applications: Application[];
}

export function CalendarView({ applications }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Build lookup: date string → apps with that date_applied or reminder_date
  const appsByDate = useMemo(() => {
    const map = new Map<string, Application[]>();
    for (const app of applications) {
      // Index by date_applied
      if (app.date_applied) {
        const key = app.date_applied;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(app);
      }
      // Also index by reminder_date
      if (app.reminder_date) {
        const key = app.reminder_date;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(app);
      }
    }
    return map;
  }, [applications]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedApps = selectedDate
    ? appsByDate.get(format(selectedDate, "yyyy-MM-dd")) ?? []
    : [];

  function prevMonth() {
    setCurrentMonth((m) => subMonths(m, 1));
    setSelectedDate(null);
  }

  function nextMonth() {
    setCurrentMonth((m) => addMonths(m, 1));
    setSelectedDate(null);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar grid */}
      <div className="retro-card bg-surface p-6 lg:flex-1">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2
            className="text-white text-xs"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {format(currentMonth, "MMMM yyyy").toUpperCase()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-white/30 text-xs font-medium py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayApps = appsByDate.get(dateStr) ?? [];
            const hasReminder = dayApps.some((a) => a.reminder_date === dateStr);
            const hasApplied = dayApps.some((a) => a.date_applied === dateStr);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 rounded-md text-sm transition-colors",
                  "hover:bg-white/5",
                  !isSameMonth(day, currentMonth) && "text-white/10",
                  isSameMonth(day, currentMonth) && "text-white/70",
                  isToday(day) && "ring-2 ring-primary/50",
                  isSelected && "bg-primary/20 ring-2 ring-primary"
                )}
              >
                <span className="text-xs">{format(day, "d")}</span>
                {(hasApplied || hasReminder) && (
                  <div className="flex gap-0.5 mt-0.5">
                    {hasApplied && (
                      <div className="w-1 h-1 rounded-full bg-applied" />
                    )}
                    {hasReminder && (
                      <div className="w-1 h-1 rounded-full bg-assessment" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date details */}
      <div className="retro-card bg-surface p-6 w-full lg:w-80 shrink-0">
        <h3
          className="text-white text-xs mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {selectedDate
            ? format(selectedDate, "MMM d, yyyy").toUpperCase()
            : "SELECT A DATE"}
        </h3>

        {selectedApps.length === 0 ? (
          <p className="text-white/30 text-sm">
            {selectedDate ? "No applications on this date." : "Click a date to see details."}
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedApps.map((app) => (
              <div
                key={app.id}
                className="bg-background border-2 border-black rounded-lg p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white font-semibold text-sm truncate">
                    {app.company}
                  </p>
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded border font-medium capitalize shrink-0",
                      "text-white/70 border-white/20"
                    )}
                  >
                    {STAGE_LABELS[app.stage]}
                  </span>
                </div>
                <p className="text-white/50 text-xs truncate">{app.role}</p>
                {app.reminder_date === format(selectedDate!, "yyyy-MM-dd") && (
                  <div className="flex items-center gap-1.5 text-assessment text-xs">
                    <Bell className="w-3 h-3" />
                    <span>Follow-up reminder</span>
                  </div>
                )}
                {app.date_applied === format(selectedDate!, "yyyy-MM-dd") && (
                  <div className="flex items-center gap-1.5 text-applied text-xs">
                    <Send className="w-3 h-3" />
                    <span>Date applied</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

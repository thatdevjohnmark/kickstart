import Link from "next/link";
import { Bell, Calendar } from "lucide-react";
import { format, parseISO, isAfter, isBefore, addDays, startOfDay } from "date-fns";
import type { Application } from "@/types/application";

interface UpcomingRemindersProps {
  applications: Application[];
}

export function UpcomingReminders({ applications }: UpcomingRemindersProps) {
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 14);

  const reminders = applications
    .filter((a) => {
      if (!a.reminder_date) return false;
      const d = startOfDay(parseISO(a.reminder_date));
      return d >= today && d <= nextWeek;
    })
    .sort((a, b) => {
      return a.reminder_date!.localeCompare(b.reminder_date!);
    });

  if (reminders.length === 0) return null;

  return (
    <div className="retro-card bg-surface p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-assessment" />
          <h2
            className="text-white text-xs"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Upcoming Reminders
          </h2>
        </div>
        <Link
          href="/calendar"
          className="text-primary text-xs hover:underline"
        >
          View calendar →
        </Link>
      </div>

      <div className="space-y-2">
        {reminders.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border-2 border-transparent hover:border-black hover:bg-white/5 transition-all group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">
                {app.company}
              </p>
              <p className="text-white/50 text-xs truncate">{app.role}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-assessment" />
              <span className="text-assessment text-xs whitespace-nowrap">
                {format(parseISO(app.reminder_date!), "MMM d")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

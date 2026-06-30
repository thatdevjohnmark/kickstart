import { getApplications } from "@/lib/actions/applications";
import { CalendarView } from "@/components/calendar/calendar-view";
import { addMonths, startOfMonth, format } from "date-fns";

export default async function CalendarPage() {
  const applications = await getApplications();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Calendar
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Track applications and reminders by date
        </p>
      </div>

      <CalendarView applications={applications} />
    </div>
  );
}

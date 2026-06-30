export default function CalendarLoading() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Calendar
        </h1>
        <p className="text-white/40 text-sm mt-1">Loading calendar…</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="retro-card bg-surface p-6 lg:flex-1">
          <phantom-ui loading animation="pulse" reveal={0.3}>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-6 h-4 bg-white/10 rounded" />
                <div className="w-40 h-4 bg-white/10 rounded" />
                <div className="w-6 h-4 bg-white/10 rounded" />
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-white/5" />
                ))}
              </div>
            </div>
          </phantom-ui>
        </div>
        <div className="retro-card bg-surface p-6 w-full lg:w-80 shrink-0">
          <phantom-ui loading animation="pulse" reveal={0.3}>
            <div className="space-y-3">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-12 bg-white/5 rounded" />
              <div className="h-12 bg-white/5 rounded" />
              <div className="h-12 bg-white/5 rounded" />
            </div>
          </phantom-ui>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Analytics
        </h1>
        <p className="text-white/40 text-sm mt-1">Loading insights…</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <phantom-ui loading animation="pulse" count={4} count-gap={16} reveal={0.3}>
          <div className="retro-card bg-surface p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-md border-2 border-black w-10 h-10" />
            <div>
              <p className="text-white/50 text-xs mb-1">Label</p>
              <p className="text-white text-2xl font-bold leading-none">000</p>
            </div>
          </div>
        </phantom-ui>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <div className="retro-card bg-surface p-6">
            <phantom-ui loading animation="pulse" reveal={0.3}>
              <div>
                <h2
                  className="text-white text-xs mb-6"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Monthly Activity
                </h2>
                <div className="h-[280px] flex items-end gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-white/10"
                      style={{ height: `${40 + Math.random() * 60}%` }}
                    />
                  ))}
                </div>
              </div>
            </phantom-ui>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="retro-card bg-surface p-6">
            <phantom-ui loading animation="pulse" reveal={0.3}>
              <div>
                <div className="flex items-start justify-between mb-6">
                  <h2
                    className="text-white text-xs"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                    Stage Breakdown
                  </h2>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Response Rate</p>
                    <p className="text-white/20 text-2xl font-bold mt-0.5">—%</p>
                  </div>
                </div>
                <div className="h-[220px] flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-4 border-white/10" />
                </div>
              </div>
            </phantom-ui>
          </div>
        </div>
      </div>

      {/* Resume performance */}
      <div className="retro-card bg-surface p-6">
        <phantom-ui loading animation="pulse" reveal={0.3}>
          <div>
            <h2
              className="text-white text-xs mb-6"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Resume Performance
            </h2>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded bg-white/10" />
                  <div className="flex-1 h-3 rounded bg-white/10" />
                  <div className="w-12 h-3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </phantom-ui>
      </div>
    </div>
  );
}

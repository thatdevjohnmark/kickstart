export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <phantom-ui loading animation="pulse" reveal={0.3}>
        <div className="mb-8">
          <p className="text-white/40 text-xs mb-1">Welcome back,</p>
          <h1
            className="text-white text-sm leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Loading...
          </h1>
        </div>
      </phantom-ui>

      {/* Stats bar skeleton — 5 cards */}
      <section className="mb-6">
        <phantom-ui loading animation="pulse" count={5} count-gap={16} reveal={0.3}>
          <div className="retro-card bg-surface p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-md border-2 border-black w-10 h-10" />
            <div>
              <p className="text-white/50 text-xs mb-1">Label</p>
              <p className="text-white text-2xl font-bold leading-none">000</p>
            </div>
          </div>
        </phantom-ui>
      </section>

      {/* Pipeline + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="retro-card bg-surface p-6">
            <phantom-ui loading animation="pulse" reveal={0.3}>
              <div>
                <h2
                  className="text-white text-xs mb-6"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Pipeline
                </h2>
                <div className="space-y-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm border border-black shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </phantom-ui>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="retro-card bg-surface p-6">
            <phantom-ui loading animation="pulse" reveal={0.3}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-white text-xs"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                    Recent
                  </h2>
                  <span className="text-primary text-xs">View all →</span>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border-2 border-transparent"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">
                          Company Name
                        </p>
                        <p className="text-white/50 text-xs truncate">Job Role Title</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </phantom-ui>
          </div>
        </div>
      </div>
    </div>
  );
}

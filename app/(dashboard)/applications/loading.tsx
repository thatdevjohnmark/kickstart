export default function ApplicationsLoading() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b-4 border-black shrink-0">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Applications
        </h1>
        <p className="text-white/40 text-sm mt-1">— total · drag cards to change stage</p>
      </div>

      {/* Board columns skeleton */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-5 p-6 h-full min-w-max">
          {["Saved", "Applied", "Assessment", "Interviewing", "Offer", "Rejected", "Ghosted"].map(
            (stage) => (
              <div key={stage} className="flex flex-col w-72 shrink-0">
                {/* Column header */}
                <div className="flex items-center justify-between px-3 py-2 mb-3 border-b-2 border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm border border-black bg-white/20" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      {stage}
                    </span>
                  </div>
                  <span className="text-white/20 text-xs font-mono">—</span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2 min-h-[100px] rounded-lg p-1">
                  <phantom-ui loading animation="pulse" count={3} count-gap={8} reveal={0.3}>
                    <div className="bg-background border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_#000]">
                      <div className="mb-2">
                        <p className="text-white font-semibold text-sm leading-tight truncate">
                          Company
                        </p>
                        <p className="text-white/50 text-xs truncate mt-0.5">Role</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <span>Location or salary info</span>
                        </div>
                      </div>
                    </div>
                  </phantom-ui>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

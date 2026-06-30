export default function ATSLoading() {
  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Header skeleton */}
      <phantom-ui loading animation="pulse" reveal={0.3}>
        <div className="mb-8">
          <h1
            className="text-white text-xs"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            ATS Resume Check
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Upload your resume to check its ATS compatibility
          </p>
        </div>
      </phantom-ui>

      {/* Upload card skeleton */}
      <div className="retro-card bg-surface p-6 border-2 border-black shadow-[4px_4px_0px_#000] mb-8">
        <phantom-ui loading animation="pulse" reveal={0.3}>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-2 p-12 border-2 border-dashed border-white/20 rounded-md">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="h-4 w-48 rounded bg-white/10" />
              <div className="h-3 w-24 rounded bg-white/10" />
            </div>
            <div className="h-20 rounded bg-white/10" />
          </div>
        </phantom-ui>
      </div>

      {/* History card skeleton */}
      <div className="retro-card bg-surface p-6 border-2 border-black shadow-[4px_4px_0px_#000]">
        <phantom-ui loading animation="pulse" reveal={0.3}>
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-white/10" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded bg-white/5 border border-white/10"
              />
            ))}
          </div>
        </phantom-ui>
      </div>
    </div>
  );
}

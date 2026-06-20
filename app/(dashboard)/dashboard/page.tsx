import { getDashboardStats, getApplications } from "@/lib/actions/applications";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { PipelineProgress } from "@/components/dashboard/pipeline-progress";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [stats, applications] = await Promise.all([
    getDashboardStats(),
    getApplications(),
  ]);

  // Derive first name from email for greeting
  const displayName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 text-xs mb-1">Welcome back,</p>
        <h1
          className="text-white text-sm leading-relaxed"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {displayName}
        </h1>
      </div>

      {/* Stats */}
      <section className="mb-6">
        <StatsBar stats={stats} />
      </section>

      {/* Pipeline + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <PipelineProgress stats={stats} />
        </div>
        <div className="lg:col-span-3">
          <RecentApplications applications={applications} />
        </div>
      </div>
    </div>
  );
}

import { getAnalyticsData } from "@/lib/actions/analytics";
import { MonthlyChart } from "@/components/analytics/monthly-chart";
import { ResponseRateChart } from "@/components/analytics/response-rate-chart";
import { ResumePerformanceTable } from "@/components/analytics/resume-performance";
import { TrendingUp, MessageSquare, Users, Trophy } from "lucide-react";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Analytics
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Insights into your job search performance
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Applications"
          value={data.totalApplications}
          icon={TrendingUp}
          color="bg-primary"
        />
        <StatCard
          label="Response Rate"
          value={`${data.responseRate}%`}
          icon={MessageSquare}
          color="bg-assessment"
        />
        <StatCard
          label="Interviews"
          value={data.totalInterviews}
          icon={Users}
          color="bg-interviewing"
        />
        <StatCard
          label="Offers"
          value={data.totalOffers}
          icon={Trophy}
          color="bg-offer"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MonthlyChart data={data.monthly} />
        </div>
        <div className="lg:col-span-2">
          <ResponseRateChart
            stageDistribution={data.stageDistribution}
            responseRate={data.responseRate}
          />
        </div>
      </div>

      {/* Resume performance */}
      <ResumePerformanceTable data={data.resumePerformance} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="retro-card bg-surface p-5 flex items-center gap-4">
      <div className={`p-2.5 rounded-md border-2 border-black ${color}`}>
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div>
        <p className="text-white/50 text-xs mb-1">{label}</p>
        <p className="text-white text-2xl font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}

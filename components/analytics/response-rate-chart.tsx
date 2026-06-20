"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { StageDistribution } from "@/types/analytics";

interface ResponseRateChartProps {
  stageDistribution: StageDistribution[];
  responseRate: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: StageDistribution }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-surface border-2 border-black rounded-lg px-4 py-3 shadow-[3px_3px_0px_#000] text-xs">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-sm"
          style={{ backgroundColor: d.payload.color }}
        />
        <span className="text-white/60">{d.name}:</span>
        <span className="text-white font-semibold">{d.value}</span>
      </div>
    </div>
  );
};

export function ResponseRateChart({
  stageDistribution,
  responseRate,
}: ResponseRateChartProps) {
  return (
    <div className="retro-card bg-surface p-6">
      <div className="flex items-start justify-between mb-6">
        <h2
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Stage Breakdown
        </h2>
        <div className="text-right">
          <p className="text-white/40 text-xs">Response Rate</p>
          <p className="text-offer text-2xl font-bold mt-0.5">{responseRate}%</p>
        </div>
      </div>

      {stageDistribution.length === 0 ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-white/30 text-sm">No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={stageDistribution}
              dataKey="count"
              nameKey="stage"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={2}
              stroke="#000"
            >
              {stageDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                paddingTop: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

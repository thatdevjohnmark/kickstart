"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { MonthlyData } from "@/types/analytics";

interface MonthlyChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border-2 border-black rounded-lg px-4 py-3 shadow-[3px_3px_0px_#000] text-xs space-y-1">
      <p className="text-white/60 font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
          <span className="text-white/60 capitalize">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="retro-card bg-surface p-6">
      <h2
        className="text-white text-xs mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Monthly Activity
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)", paddingTop: 12 }}
          />
          <Bar dataKey="applications" fill="#6c82ff" radius={[3, 3, 0, 0]} name="Applications" />
          <Bar dataKey="interviews" fill="#fb923c" radius={[3, 3, 0, 0]} name="Interviews" />
          <Bar dataKey="offers" fill="#34d399" radius={[3, 3, 0, 0]} name="Offers" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

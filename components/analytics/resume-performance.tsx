import { cn } from "@/lib/utils";
import type { ResumePerformance } from "@/types/analytics";
import { FileText } from "lucide-react";

interface ResumePerformanceTableProps {
  data: ResumePerformance[];
}

export function ResumePerformanceTable({ data }: ResumePerformanceTableProps) {
  return (
    <div className="retro-card bg-surface p-6">
      <h2
        className="text-white text-xs mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Resume Performance
      </h2>

      {data.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <FileText className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-white/30 text-sm">
            Link resumes to applications to see performance data.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-white/10">
                <th className="text-left text-white/40 text-xs font-medium pb-3 pr-4">Resume</th>
                <th className="text-right text-white/40 text-xs font-medium pb-3 px-4">Apps</th>
                <th className="text-right text-white/40 text-xs font-medium pb-3 px-4">Interviews</th>
                <th className="text-right text-white/40 text-xs font-medium pb-3 px-4">Offers</th>
                <th className="text-right text-white/40 text-xs font-medium pb-3 pl-4">
                  Interview Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((row) => (
                <tr key={row.resume_id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-white text-sm font-medium truncate max-w-[160px]">
                        {row.resume_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-white/70 text-sm">
                    {row.applications}
                  </td>
                  <td className="py-3 px-4 text-right text-interviewing text-sm">
                    {row.interviews}
                  </td>
                  <td className="py-3 px-4 text-right text-offer text-sm">
                    {row.offers}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <RateBar value={row.interview_rate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RateBar({ value }: { value: number }) {
  const color =
    value >= 50 ? "bg-offer" : value >= 25 ? "bg-assessment" : "bg-applied";

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-white/60 text-xs w-9 text-right">{value}%</span>
    </div>
  );
}

import { getResumeChecks } from "@/lib/actions/resume-checks";
import { AtsForm } from "@/components/ats/ats-form";
import { AtsHistory } from "@/components/ats/ats-history";

export default async function ATSPage() {
  const checks = await getResumeChecks();

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
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

      <div className="space-y-8">
        {/* Upload + Results */}
        <div className="retro-card bg-surface p-6 border-2 border-black shadow-[4px_4px_0px_#000]">
          <AtsForm />
        </div>

        {/* History */}
        <div className="retro-card bg-surface p-6 border-2 border-black shadow-[4px_4px_0px_#000]">
          <AtsHistory checks={checks} />
        </div>
      </div>
    </div>
  );
}

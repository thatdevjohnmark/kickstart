import { getApplications } from "@/lib/actions/applications";
import { getResumes } from "@/lib/actions/resumes";
import { Board } from "@/components/board/board";

export default async function ApplicationsPage() {
  const [applications, resumes] = await Promise.all([
    getApplications(),
    getResumes(),
  ]);

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 lg:px-8 py-4 lg:py-5 border-b-4 border-black shrink-0">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Applications
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {applications.length} total · drag cards to change stage
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <Board initialApplications={applications} resumes={resumes} />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { getResumes } from "@/lib/actions/resumes";
import { ResumeManager } from "@/components/settings/resume-manager";
import { AccountSettings } from "@/components/settings/account-settings";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resumes = await getResumes();

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Settings
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your account and resumes
        </p>
      </div>

      <div className="space-y-8">
        <AccountSettings email={user?.email ?? ""} />
        <ResumeManager initialResumes={resumes} />
      </div>
    </div>
  );
}

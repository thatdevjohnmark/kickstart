"use server";

import { createClient } from "@/lib/supabase/server";
import { analyzeResumeText, type AtsResult, type AtsCheck } from "@/lib/ats/engine";
import { revalidatePath } from "next/cache";

export interface ResumeCheck {
  id: string;
  user_id: string;
  filename: string;
  score: number;
  checks: AtsCheck[];
  recommendations: string[];
  missing_keywords: string[];
  job_description: string | null;
  created_at: string;
}

export async function analyzeResume(
  formData: FormData
): Promise<{ result: AtsResult; id: string } | { error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const text = formData.get("text") as string | null;
    const filename = formData.get("filename") as string | null;
    const jobDescription = (formData.get("jobDescription") as string) || undefined;

    if (!text?.trim()) return { error: "No text extracted from file." };
    if (!filename) return { error: "Missing filename." };

    const result = analyzeResumeText(text, filename, jobDescription);

    const { data, error } = await supabase
      .from("resume_checks")
      .insert({
        user_id: user.id,
        filename,
        extracted_text: text,
        score: result.score,
        checks: result.checks,
        recommendations: result.recommendations,
        missing_keywords: result.missingKeywords,
        job_description: jobDescription ?? null,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath("/ats");
    return { result, id: data.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Analysis failed." };
  }
}

// ponytail: callers expect created_at desc for oldest-last sparkline ordering
export async function getResumeChecks(): Promise<ResumeCheck[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("resume_checks")
    .select("id, user_id, filename, score, checks, recommendations, missing_keywords, job_description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("getResumeChecks:", error.message);
    return [];
  }

  return (data ?? []) as ResumeCheck[];
}

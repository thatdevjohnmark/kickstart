"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Application, DashboardStats, Stage } from "@/types/application";

// ─── Schemas ────────────────────────────────────────────────────────────────

const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  stage: z.enum([
    "saved",
    "applied",
    "assessment",
    "interviewing",
    "offer",
    "rejected",
    "ghosted",
  ]),
  location: z.string().optional(),
  salary: z.string().optional(),
  job_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  date_applied: z.string().optional(),
});

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getApplications(): Promise<Application[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Application[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("stage");

  if (error) throw new Error(error.message);

  const rows = data as { stage: Stage }[];
  const total = rows.length;

  // Stage counts
  const countMap: Record<string, number> = {};
  for (const row of rows) {
    countMap[row.stage] = (countMap[row.stage] ?? 0) + 1;
  }

  const stageCounts = Object.entries(countMap).map(([stage, count]) => ({
    stage: stage as Stage,
    count,
  }));

  const active = rows.filter((r) =>
    ["applied", "assessment", "interviewing"].includes(r.stage)
  ).length;

  const interviews = countMap["interviewing"] ?? 0;
  const offers = countMap["offer"] ?? 0;

  const applied = rows.filter((r) => r.stage !== "saved").length;
  const responseEligible = rows.filter((r) =>
    ["interviewing", "offer"].includes(r.stage)
  ).length;
  const responseRate =
    applied > 0 ? Math.round((responseEligible / applied) * 100) : 0;

  return { total, active, responseRate, interviews, offers, stageCounts };
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createApplication(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const raw = {
    company: formData.get("company"),
    role: formData.get("role"),
    stage: formData.get("stage") ?? "saved",
    location: formData.get("location") ?? undefined,
    salary: formData.get("salary") ?? undefined,
    job_url: formData.get("job_url") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    date_applied: formData.get("date_applied") ?? undefined,
  };

  const validated = applicationSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { error } = await supabase.from("applications").insert({
    ...validated.data,
    user_id: user.id,
    job_url: validated.data.job_url || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function updateApplication(id: string, formData: FormData) {
  const supabase = await createClient();

  const raw = {
    company: formData.get("company"),
    role: formData.get("role"),
    stage: formData.get("stage") ?? "saved",
    location: formData.get("location") ?? undefined,
    salary: formData.get("salary") ?? undefined,
    job_url: formData.get("job_url") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    date_applied: formData.get("date_applied") ?? undefined,
  };

  const validated = applicationSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { error } = await supabase
    .from("applications")
    .update({ ...validated.data, job_url: validated.data.job_url || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function updateApplicationStage(id: string, stage: Stage) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ stage })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

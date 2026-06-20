"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Resume } from "@/types/resume";

const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file_url: z.string().url().optional().or(z.literal("")),
});

export async function getResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Resume[];
}

export async function createResume(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const validated = resumeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    file_url: formData.get("file_url") ?? undefined,
  });

  if (!validated.success) return { error: validated.error.issues[0]?.message ?? "Validation failed" };

  const { error } = await supabase.from("resumes").insert({
    ...validated.data,
    user_id: user.id,
    file_url: validated.data.file_url || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

export async function updateResume(id: string, formData: FormData) {
  const supabase = await createClient();

  const validated = resumeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    file_url: formData.get("file_url") ?? undefined,
  });

  if (!validated.success) return { error: validated.error.issues[0]?.message ?? "Validation failed" };

  const { error } = await supabase
    .from("resumes")
    .update({ ...validated.data, file_url: validated.data.file_url || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteResume(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("resumes").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

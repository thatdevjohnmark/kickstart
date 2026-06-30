"use client";

import { useState, useTransition } from "react";
import {
  createApplication,
  updateApplication,
  updateApplicationStage,
  deleteApplication,
} from "@/lib/actions/applications";
import type { Application, Stage } from "@/types/application";

export function useApplications(initial: Application[]) {
  const [applications, setApplications] = useState<Application[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function optimisticMove(id: string, stage: Stage) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage } : a))
    );
  }

  async function moveApplication(id: string, stage: Stage) {
    // Guard: don't send temp IDs to the server
    if (id.startsWith("temp_")) return;

    const previous = applications;
    optimisticMove(id, stage);

    startTransition(async () => {
      const result = await updateApplicationStage(id, stage);
      if (result.error) {
        setApplications(previous);
        setError(result.error);
      }
    });
  }

  async function addApplication(formData: FormData) {
    setError(null);
    const company = formData.get("company") as string | null;
    const role = formData.get("role") as string | null;
    const stage = (formData.get("stage") as Stage) ?? "saved";
    const resume_id = (formData.get("resume_id") as string) || null;

    // Optimistic insert with a temp id so it shows immediately
    const tempId = `temp_${crypto.randomUUID()}`;
    const optimistic: Application = {
      id: tempId,
      user_id: "",
      company: company ?? "",
      role: role ?? "",
      stage,
      location: (formData.get("location") as string) ?? null,
      salary: (formData.get("salary") as string) ?? null,
      job_url: (formData.get("job_url") as string) ?? null,
      notes: (formData.get("notes") as string) ?? null,
      resume_id,
      date_applied: (formData.get("date_applied") as string) ?? null,
      reminder_date: (formData.get("reminder_date") as string) ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setApplications((prev) => [optimistic, ...prev]);

    const result = await createApplication(formData);
    if (result.error) {
      setApplications((prev) => prev.filter((a) => a.id !== tempId));
      setError(result.error);
    } else if (result.application) {
      // Replace temp card with real one so subsequent drags/edits use a valid UUID
      setApplications((prev) =>
        prev.map((a) => (a.id === tempId ? result.application! : a))
      );
    }
    return result;
  }

  async function editApplication(id: string, formData: FormData) {
    setError(null);
    const company = formData.get("company") as string | null;
    const role = formData.get("role") as string | null;
    const stage = formData.get("stage") as Stage | null;

    // Optimistic update
    const previous = applications;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              company: company ?? a.company,
              role: role ?? a.role,
              stage: stage ?? a.stage,
              location: (formData.get("location") as string) ?? a.location,
              salary: (formData.get("salary") as string) ?? a.salary,
              job_url: (formData.get("job_url") as string) ?? a.job_url,
              notes: (formData.get("notes") as string) ?? a.notes,
              date_applied: (formData.get("date_applied") as string) ?? a.date_applied,
              reminder_date: (formData.get("reminder_date") as string) ?? a.reminder_date,
              resume_id: (formData.get("resume_id") as string) ?? a.resume_id,
            }
          : a
      )
    );

    const result = await updateApplication(id, formData);
    if (result.error) {
      setApplications(previous);
      setError(result.error);
    }
    return result;
  }

  async function removeApplication(id: string) {
    // Guard: don't send temp IDs to the server
    if (id.startsWith("temp_")) return;

    setError(null);
    const previous = applications;
    setApplications((prev) => prev.filter((a) => a.id !== id));

    startTransition(async () => {
      const result = await deleteApplication(id);
      if (result.error) {
        setApplications(previous);
        setError(result.error);
      }
    });
  }

  return {
    applications,
    setApplications,
    isPending,
    error,
    moveApplication,
    addApplication,
    editApplication,
    removeApplication,
  };
}

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
    const result = await createApplication(formData);
    if (result.error) setError(result.error);
    return result;
  }

  async function editApplication(id: string, formData: FormData) {
    setError(null);
    const result = await updateApplication(id, formData);
    if (result.error) setError(result.error);
    return result;
  }

  async function removeApplication(id: string) {
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

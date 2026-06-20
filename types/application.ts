export const STAGES = [
  "saved",
  "applied",
  "assessment",
  "interviewing",
  "offer",
  "rejected",
  "ghosted",
] as const;

export type Stage = (typeof STAGES)[number];

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  stage: Stage;
  location: string | null;
  salary: string | null;
  job_url: string | null;
  notes: string | null;
  resume_id: string | null;
  date_applied: string | null;
  created_at: string;
  updated_at: string;
}

export interface StageCount {
  stage: Stage;
  count: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  responseRate: number;
  interviews: number;
  offers: number;
  stageCounts: StageCount[];
}

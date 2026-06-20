export interface MonthlyData {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
}

export interface StageDistribution {
  stage: string;
  count: number;
  color: string;
}

export interface ResumePerformance {
  resume_id: string;
  resume_name: string;
  applications: number;
  interviews: number;
  offers: number;
  interview_rate: number;
  offer_rate: number;
}

export interface AnalyticsData {
  monthly: MonthlyData[];
  stageDistribution: StageDistribution[];
  responseRate: number;
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  resumePerformance: ResumePerformance[];
}

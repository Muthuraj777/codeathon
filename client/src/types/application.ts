export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Interviewing' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchPercent: number;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
}

export interface DashboardStats {
  totalEmployees: number; // e.g. 250
  totalJobs: number; // e.g. 45
  totalApplications: number; // e.g. 120
  averageMatchPercent: number; // e.g. 74%
  topSkillGaps: Array<{
    skillName: string;
    gapCount: number;
    percentage: number;
    category: string;
  }>;
}

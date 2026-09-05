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
  totalEmployees: number;
  totalJobs: number;
  totalApplications: number;
  averageMatchPercent: number;
  employeesMeta?: string;
  jobsMeta?: string;
  applicationsMeta?: string;
  matchMeta?: string;
  topSkillGaps: Array<{
    skillName: string;
    gapCount: number;
    percentage: number;
    category: string;
  }>;
}


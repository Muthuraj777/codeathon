import type { DashboardStats } from '../types/application';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalEmployees: 250,
  totalJobs: 45,
  totalApplications: 120,
  averageMatchPercent: 74,
  topSkillGaps: [
    { skillName: 'Spring Boot', gapCount: 85, percentage: 85, category: 'Backend Framework' },
    { skillName: 'React', gapCount: 65, percentage: 65, category: 'Frontend UI' },
    { skillName: 'AWS', gapCount: 48, percentage: 48, category: 'Cloud & Infrastructure' },
    { skillName: 'Docker', gapCount: 32, percentage: 32, category: 'DevOps & Containers' },
  ],
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      return MOCK_DASHBOARD_STATS;
    }
  },
};

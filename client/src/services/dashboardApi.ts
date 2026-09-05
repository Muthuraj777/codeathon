import type { DashboardStats } from '../types/application';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const INITIAL_DASHBOARD_STATS: DashboardStats = {
  totalEmployees: 0,
  totalJobs: 0,
  totalApplications: 0,
  averageMatchPercent: 0,
  employeesMeta: '0 registered candidates',
  jobsMeta: '0 active job posts',
  applicationsMeta: '0 applications submitted',
  matchMeta: 'No applications yet',
  topSkillGaps: [],
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      const data = await res.json();
      return data.data || data;
    } catch {
      return INITIAL_DASHBOARD_STATS;
    }
  },
};


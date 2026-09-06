import { create } from 'zustand';
import type { DashboardStats } from '../types/application';
import { dashboardApi, INITIAL_DASHBOARD_STATS } from '../services/dashboardApi';

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: INITIAL_DASHBOARD_STATS,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dashboardApi.getStats();
      set({ stats: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load dashboard metrics', isLoading: false });
    }
  },
}));


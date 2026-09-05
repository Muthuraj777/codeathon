import { create } from 'zustand';
import type { Application, ApplicationStatus } from '../types/application';
import { applicationApi, MOCK_APPLICATIONS } from '../services/applicationApi';

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchApplications: () => Promise<void>;
  submitApplication: (payload: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    matchPercent: number;
  }) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<boolean>;
  clearMessages: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: MOCK_APPLICATIONS,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const apps = await applicationApi.getApplications();
      set({ applications: apps, isLoading: false });
    } catch {
      set({ applications: MOCK_APPLICATIONS, isLoading: false });
    }
  },

  submitApplication: async (payload) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const newApp = await applicationApi.submitApplication(payload);
      set((state) => ({
        applications: [newApp, ...state.applications],
        isSubmitting: false,
        successMessage: `Application for ${payload.jobTitle} submitted successfully!`,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit application', isSubmitting: false });
      return false;
    }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const updatedApp = await applicationApi.updateStatus(id, status);
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? updatedApp : a)),
        successMessage: `Application status updated to ${status}`,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update application status' });
      return false;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));

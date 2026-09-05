import { create } from 'zustand';
import { jobApi } from '../services/jobApi';

export interface JobSkillRequirement {
  id: string;
  skillId: string;
  name: string;
  category: string;
  requiredLevel: number;
  mandatory: boolean;
}

interface JobState {
  jobs: any[];
  selectedJob: any | null;
  jobSkills: JobSkillRequirement[];
  isLoading: boolean;
  error: string | null;

  fetchJobs: (search?: string) => Promise<void>;
  fetchJobDetails: (jobId: string) => Promise<void>;
  createJob: (jobData: { company: string; title: string; location?: string; description?: string }) => Promise<void>;
  updateJob: (id: string, jobData: any) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateRequiredSkill: (jobId: string, skillId: string, requiredLevel: number, mandatory?: boolean) => Promise<void>;
  removeRequiredSkill: (jobId: string, skillId: string) => Promise<void>;
  clearError: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  selectedJob: null,
  jobSkills: [],
  isLoading: false,
  error: null,

  fetchJobs: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobApi.getJobs(search);
      set({ jobs: res.data?.jobs || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchJobDetails: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const resDetails = await jobApi.getJobById(jobId);
      const resSkills = await jobApi.getJobSkills(jobId);
      set({
        selectedJob: resDetails.data?.job,
        jobSkills: resSkills.data?.requiredSkills || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.createJob(jobData);
      await get().fetchJobs();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateJob: async (id, jobData) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.updateJob(id, jobData);
      await get().fetchJobs();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.deleteJob(id);
      await get().fetchJobs();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateRequiredSkill: async (jobId, skillId, requiredLevel, mandatory = true) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.addOrUpdateJobSkill(jobId, { skill_id: skillId, required_level: requiredLevel, mandatory });
      await get().fetchJobDetails(jobId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  removeRequiredSkill: async (jobId, skillId) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.removeJobSkill(jobId, skillId);
      await get().fetchJobDetails(jobId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

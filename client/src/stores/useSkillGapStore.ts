import { create } from 'zustand';
import type { Student, Job, SkillGapResponse } from '../types/skillGap';
import { skillGapApi } from '../services/skillGapApi';

interface SkillGapState {
  students: Student[];
  jobs: Job[];
  selectedStudentId: string;
  selectedJobId: string;
  analysisResult: SkillGapResponse['data'] | null;
  isLoading: boolean;
  error: string | null;

  setSelectedStudentId: (id: string) => void;
  setSelectedJobId: (id: string) => void;
  loadData: () => Promise<void>;
  runAnalysis: (studentId?: string, jobId?: string) => Promise<void>;
}

export const useSkillGapStore = create<SkillGapState>((set, get) => ({
  students: [],
  jobs: [],
  selectedStudentId: '',
  selectedJobId: '',
  analysisResult: null,
  isLoading: false,
  error: null,

  setSelectedStudentId: (id) => {
    set({ selectedStudentId: id });
    get().runAnalysis(id, get().selectedJobId);
  },

  setSelectedJobId: (id) => {
    set({ selectedJobId: id });
    get().runAnalysis(get().selectedStudentId, id);
  },

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [fetchedStudents, fetchedJobs] = await Promise.all([
        skillGapApi.getStudents(),
        skillGapApi.getJobs(),
      ]);

      const students = fetchedStudents || [];
      const jobs = fetchedJobs || [];

      const getEntityId = (item: any) => item?._id || item?.id || '';

      const initialStudentId = students.length > 0 ? getEntityId(students[0]) : '';
      const initialJobId = jobs.length > 0 ? getEntityId(jobs[0]) : '';

      set({
        students,
        jobs,
        selectedStudentId: initialStudentId,
        selectedJobId: initialJobId,
      });

      if (initialStudentId && initialJobId) {
        await get().runAnalysis(initialStudentId, initialJobId);
      } else {
        set({ isLoading: false, analysisResult: null });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to load system data', isLoading: false, analysisResult: null });
    }
  },

  runAnalysis: async (studentId, jobId) => {
    const sId = studentId || get().selectedStudentId;
    const jId = jobId || get().selectedJobId;

    if (!sId || !jId) return;

    set({ isLoading: true, error: null });
    try {
      const result = await skillGapApi.getSkillGap(sId, jId);
      set({ analysisResult: result, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to calculate skill gap analysis', isLoading: false });
    }
  },
}));


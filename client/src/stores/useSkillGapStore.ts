import { create } from 'zustand';
import type { Student, Job, SkillGapResponse } from '../types/skillGap';
import { skillGapApi, MOCK_STUDENTS, MOCK_JOBS } from '../services/skillGapApi';

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
  students: MOCK_STUDENTS,
  jobs: MOCK_JOBS,
  selectedStudentId: 'student-101',
  selectedJobId: 'job-501',
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

      const students = fetchedStudents.length > 0 ? fetchedStudents : MOCK_STUDENTS;
      const jobs = fetchedJobs.length > 0 ? fetchedJobs : MOCK_JOBS;

      const initialStudentId = students[0]?.id || 'student-101';
      const initialJobId = jobs[0]?.id || 'job-501';

      set({
        students,
        jobs,
        selectedStudentId: initialStudentId,
        selectedJobId: initialJobId,
      });

      await get().runAnalysis(initialStudentId, initialJobId);
    } catch {
      set({ error: 'Failed to load system data', isLoading: false });
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
